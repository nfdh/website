<?php
require 'lib/vendor/autoload.php';

use Conf\Settings;
use Lib\Telemetry;
use Lib\Database;
use Lib\Uuid;
use Lib\Auth;
use Lib\MailerFactory;
use Lib\Utils;

session_start();

$user = null;
if(isset($_SESSION['user'])) {
    $user = $_SESSION['user'];
}

$conf = Settings::get();
$telemetry = new Lib\Telemetry($conf['appInsights'], $user != null ? $user['id'] : null);
$db = new Lib\Database($conf['db'], $telemetry);
$mailer_factory = new Lib\MailerFactory($conf['mail']);
$url = $conf['url'];
$file_storage = $conf['file_storage'];

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) use ($db, $user, $mailer_factory, $url, $file_storage) {
    $r->addRoute('POST', 'api/login', function($_, $values) use ($db, $user) {
        $user = Auth::login($db, $values['email'], $values['password']);
        if(!$user) {
            return false;
        }

        return [
			"name" => $user['name'],
            "email" => $user['email'],
			"role_website_contributor" => $user['role_website_contributor'],
			"role_studbook_administrator" => $user['role_studbook_administrator'],
			"role_studbook_inspector" => $user['role_studbook_inspector']
        ];
    });

    $r->addRoute('POST', 'api/request-password-reset', function($_, $values) use ($db, $user, $mailer_factory, $url) {
        if($user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $email = $values['email'];

        // Check if there is a user with this e-mail address
        $row = $db->querySingle("
            SELECT `id`, `name`
            FROM `users`
            WHERE `email` = :email
        ", [
            ":email" => $values['email']
        ]);

        if(!$row) {
            return [
                "success" => true
            ];
        }

        // Generate a reset code and store it
        $token = Uuid::generate();
        $generated_at = Utils::now_utc();
        $user_id = $row['id'];
        $db->execute("
            INSERT INTO `reset_password_tokens` (`user_id`, `token`, `generated_on`)
            VALUES (:user_id, :token, :generated_on)
        ", [
            ":user_id" => $user_id,
            ":token" => $token,
            ":generated_on" => Utils::format_datetime_for_mysql($generated_at)
        ]);

        // Send the code via mail
        $escaped_name = htmlspecialchars($row['name']);

        $body = "<p>Hallo $escaped_name,</p>";
        $body .= "<p>U heeft via de website aangegeven uw wachtwoord opnieuw in te willen stellen. Klik op de link hieronder om verder te gaan.</p>";
        $body .= "<p><a href=\"$url/wachtwoord-vergeten/opnieuw-instellen?code=$token\">Wachtwoord opnieuw instellen</a></p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap</p>";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Wachtwoord opnieuw instellen';
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($values['email']);
        $mailer->Send();

        return [
            "success" => true
        ];
    });

    $r->addRoute('GET', 'api/check-password-reset-token', function($_, $values) use ($db, $user) {
        if($user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $token = $values['token'];

        $row = $db->querySingle("
            SELECT 1 AS `exists`
            FROM `reset_password_tokens`
            WHERE `token` = :token
        ", [
            ":token" => $token
        ]);

        return [
            "success" => true,
            "valid" => !!$row
        ];
    });

    $r->addRoute('POST', 'api/reset-password', function($_, $values) use($db, $user, $mailer_factory) {
        if($user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $token = $values['token'];
        
        $row = $db->querySingle("
            SELECT `user_id`, `generated_on`
            FROM `reset_password_tokens`
            WHERE `token` = :token
        ", [
            ":token" => $token
        ]);

        if(!$row) {
            return [
                "success" => false
            ];
        }

        // Update the user password
        $new_hash = password_hash($values['new_password'], PASSWORD_DEFAULT);

        $db->execute("
            UPDATE `users`
            SET `password_hash` = :new_hash
            WHERE `id` = :user_id
        ", [
            ":user_id" => $row['user_id'],
            ":new_hash" => $new_hash
        ]);

        // Delete the reset token
        $db->execute("
            DELETE
            FROM `reset_password_tokens`
            WHERE `token` = :token
        ", [
            ":token" => $token
        ]);

        // Log the user in automatically
        $user = Auth::login_direct($db, $row['user_id']);

        // Notify the user their password has changed
        $escaped_name = htmlspecialchars($user['name']);

        $body = "<p>Hallo $escaped_name,</p>";
        $body .= "<p>U heeft uw wachtwoord gewijzigd waarmee u inlogd op de website.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap</p>";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Wachtwoord gewijzigd';
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($user['email']);
        $mailer->Send();

        return [
			"name" => $user['name'],
            "email" => $user['email'],
			"role_website_contributor" => $user['role_website_contributor'],
			"role_studbook_administrator" => $user['role_studbook_administrator'],
			"role_studbook_inspector" => $user['role_studbook_inspector']
        ];
    });

    $r->addRoute('GET', 'api/users', function($_, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $filter = null;
        
        if(isset($_GET['filter'])) {
            $filterSql = "
                WHERE `name` LIKE :nameFilter
                OR `email` LIKE :emailFilter
            ";

            $filter = str_replace(['\\', '_', '%'], ['\\\\', '\\_', '\\%'], $_GET['$filter']);
        }
        else {
            $filterSql = "";
        }

        // Count total number of users
        $sqlParameters = [];
        if($filter) {
            $sqlParameters[":nameFilter"] = "%$filter%";
            $sqlParameters[":emailFilter"] = "%$filter%";
        }
        $row = $db->querySingle("
            SELECT COUNT(1) AS `cnt`
            FROM `users`
            $filterSql
        ", $sqlParameters);
        $totalCount = $row['cnt'];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $sqlParameters = [
            ":limit" => $pageSize,
            ":skip" => $page * $pageSize
        ];
        if($filter) {
            $sqlParameters[":nameFilter"] = "%$filter%";
            $sqlParameters[":emailFilter"] = "%$filter%";
        }

        $rows = $db->queryAll("
            SELECT `id`, `name`, `email` 
            FROM `users`
            $filterSql
            LIMIT :limit
            OFFSET :skip
        ", $sqlParameters);

        return [
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'email' => $row['email']
                ];
            }, $rows)
        ];
    });

    $r->addRoute('GET', 'api/users/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        // Count total number of users
        $user = $db->querySingle("
            SELECT 
                `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector`
            FROM `users`
            WHERE id = :id
        ", [
            ':id' => intval($id)
        ]);

        if(!$user) {
            return [
                'success' => false,
                'reason' => 'USER_NOT_FOUND'
            ];
        }

        return [
            'success' => true,
            'user' => [
                'name' => $user['name'],
                'email' => $user['email'],
                'studbook_heideschaap' => $user['studbook_heideschaap'], 
                'studbook_heideschaap_ko' => $user['studbook_heideschaap_ko'], 
                'studbook_schoonebeeker' => $user['studbook_schoonebeeker'],
                'studbook_schoonebeeker_ko' => $user['studbook_schoonebeeker_ko'], 
                'role_website_contributor' => $user['role_website_contributor'],
                'role_studbook_administrator' => $user['role_studbook_administrator'], 
                'role_studbook_inspector' => $user['role_studbook_inspector']
            ]
        ];
    });

    $r->addRoute('DELETE', 'api/users', function($_, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }
        
        $sql = "
            DELETE
            FROM `users`
        ";

        $type = $values['type'];
        $items = array_values($values['items']);
        $sqlParameters = [];

        if($type === 'including') {
            $sql .= "WHERE `id` IN (";
            foreach($items as $k => $v) {
                $sql .= ":i$k";
                $sqlParameters[":i$k"] = $v;
            }
            $sql .= ")";
        }
        else if($type === 'excluding') {
            if(count($items) > 0) {
                $sql .= "WHERE `id` NOT IN (";
                foreach($items as $k => $v) {
                    $sql .= ":i$k";
                    $sqlParameters[":i$k"] = $v;
                }
                $sql .= ")";
            }
        }

        $db->execute($sql, $sqlParameters);

        return [
            'success' => true
        ];
    });

    $r->addRoute('POST', 'api/users', function($_, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        try {
            $db->execute("
                INSERT INTO `users` (
                    `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                    `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector`
                )
                VALUES (
                    :email, :name, :studbook_heideschaap, :studbook_heideschaap_ko, :studbook_schoonebeeker, :studbook_schoonebeeker_ko,
                    :role_website_contributor, :role_studbook_administrator, :role_studbook_inspector
                )
            ", [
                ':email' => $values['email'],
                ':name' => $values['name'],
                ':studbook_heideschaap' => $values['studbook_heideschaap'],
                ':studbook_heideschaap_ko' => $values['studbook_heideschaap_ko'],
                ':studbook_schoonebeeker' => $values['studbook_schoonebeeker'],
                ':studbook_schoonebeeker_ko' => $values['studbook_schoonebeeker_ko'],
                ':role_website_contributor' => $values['role_website_contributor'],
                ':role_studbook_administrator' => $values['role_studbook_administrator'],
                ':role_studbook_inspector' => $values['role_studbook_inspector']
            ]);

            return [
                "success" => true,
                "id" => $db->lastInsertId()
            ];
        }
        catch (\PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                return [
                    "success" => false,
                    "reason" => "EMAIL_ALREADY_IN_USE"
                ];
            }
        }

        return [
            "success" => false,
            "reason" => "UNKNOWN"
        ];
    });

    $r->addRoute('PATCH', 'api/users/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        try {
            $db->execute("
                UPDATE `users` 
                SET
                    `email` = :email, 
                    `name` = :name,
                    `studbook_heideschaap` = :studbook_heideschaap, 
                    `studbook_heideschaap_ko` = :studbook_heideschaap_ko, 
                    `studbook_schoonebeeker` = :studbook_schoonebeeker, 
                    `studbook_schoonebeeker_ko` = :studbook_schoonebeeker_ko, 
                    `role_website_contributor` = :role_website_contributor, 
                    `role_studbook_administrator` = :role_studbook_administrator, 
                    `role_studbook_inspector` = :role_studbook_inspector
                WHERE
                    id = :id
            ", [
                ':id' => intval($id),
                ':email' => $values['email'],
                ':name' => $values['name'],
                ':studbook_heideschaap' => $values['studbook_heideschaap'],
                ':studbook_heideschaap_ko' => $values['studbook_heideschaap_ko'],
                ':studbook_schoonebeeker' => $values['studbook_schoonebeeker'],
                ':studbook_schoonebeeker_ko' => $values['studbook_schoonebeeker_ko'],
                ':role_website_contributor' => $values['role_website_contributor'],
                ':role_studbook_administrator' => $values['role_studbook_administrator'],
                ':role_studbook_inspector' => $values['role_studbook_inspector']
            ]);

            return [
                "success" => true
            ];
        }
        catch (\PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                return [
                    "success" => false,
                    "reason" => "EMAIL_ALREADY_IN_USE"
                ];
            }
        }

        return [
            "success" => false,
            "reason" => "UNKNOWN"
        ];
    });

    $r->addRoute('GET', 'api/dekverklaringen', function($para, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        // Count total number of users
        $row = $db->querySingle("
            SELECT COUNT(1) AS `cnt`
            FROM `dekverklaringen`
            WHERE
                `user_id` = :user_id
        ", [
            ':user_id' => $user['id']
        ]);
        $totalCount = $row['cnt'];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $rows = $db->queryAll("
            SELECT `id`, `season`, `studbook`, `date_sent`
            FROM `dekverklaringen`
            WHERE
                `user_id` = :user_id
            LIMIT :limit
            OFFSET :skip
        ", [
            ':limit' => $pageSize,
            ':skip' => $page * $pageSize,
            ':user_id' => $user['id']
        ]);

        return [
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    "id" => $row['id'],
                    "season" => $row['season'],
                    "studbook" => $row['studbook'],
                    "date_sent" => Utils::format_datetime_for_json(Utils::parse_datetime_from_mysql($row['date_sent']))
                ];
            }, $rows)
        ];
    });

    $r->addRoute('POST', 'api/dekverklaringen', function($_, $values) use ($db, $user, $file_storage) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        // TODO: Properly validate input json

        // Create PDF
        $lh = 6;
        $cl = 40;
        $cl2 = 100;

        $pdf = new FPDF();

        $pdf->SetMargins(15, 15, 15);
        $pdf->AddPage();
        $pdf->SetFont('Arial','B',16);
      
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->SetXY(-40, 15);
        $pdf->Image("./lib/nfdh_logo.png");
        $pdf->SetXY($x, $y);

        $pdf->Write($lh, 'Dekverklaring');
        $pdf->Ln($lh);
        $pdf->SetFont('Arial','I', 11);
        $pdf->Write($lh, Utils::format_date(new \DateTime("now"), "%A %e %B %Y %H:%M"));
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial','',12);
        $pdf->Cell($cl, $lh, "Dekseizoen:");
        $pdf->Write($lh, $values['season']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Naam:");
        $pdf->Write($lh, $values['name']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "KO kudde:");
        $pdf->Write($lh, true ? "Ja" : "Nee");
        $pdf->Ln($lh);

        $pdf->Cell($cl, $lh, "Ras:");
        $pdf->Write($lh, Utils::ras_num_to_str($values['studbook']));

        if(true) {
            $pdf->Ln($lh * 2);
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Write($lh, "Kuddeovereenkomst");
            $pdf->SetFont('Arial','',12);
            $pdf->Ln($lh);

            $seasonMinus2 = $values['season'] - 2;
            $pdf->Cell($cl2, $lh, "Aantal aanwezige volwassen ooien ($seasonMinus2 en ouder):");
            $pdf->Write($lh, $values['kovo']);
            $pdf->Ln($lh);

            $seasonMinus1 = $values['season'] - 1;
            $pdf->Cell($cl2, $lh, "Aantal aanwezige enters (geb. $seasonMinus1):");
            $pdf->Write($lh, $values['koe']);
            $pdf->Ln($lh);

            $season = $values['season'];
            $pdf->Cell($cl2, $lh, "Aantal ooilammeren (geb. $season):");
            $pdf->Write($lh, $values['kool']);
            $pdf->Ln($lh);
            $pdf->Cell($cl2, $lh, "Aantal ramlammeren (geb. $season):");
            $pdf->Write($lh, $values['korl']);
        }
      
        foreach ($values['dekgroepen'] as $groep_idx => $groep) {
            $aantal_ooien = $groep["ewe_count"];    
            $rammen = $groep["rammen"];
            $dekgroep_no = $groep_idx + 1;

            $pdf->Ln($lh * 2);
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Write($lh, "Dekgroep $dekgroep_no");
            $pdf->SetFont('Arial','',12);
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Aantal ooien:");
            $pdf->write($lh, $aantal_ooien);
            foreach ($rammen as $ram_idx => $ram) {
                $ram_no = $ram_idx + 1;

                $pdf->Ln($lh);
                $pdf->Cell($cl, $lh, "Ram $ram_no:");
                $pdf->Write($lh, $ram);
            }
        }
      
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Write($lh, "Opmerking");
        $pdf->SetFont('Arial','',12);
        $pdf->Ln($lh);
        $pdf->Write($lh, $values['remarks']);
      
        $uuid = Uuid::generate();
        $pdf_path = $file_storage . DIRECTORY_SEPARATOR . $uuid . ".pdf";

        $pdf->Output('F', $pdf_path);
            
        $json = json_encode([
            'season' => $values['season'],
            'studbook' => $values['studbook'],
            'name' => $values['name'],
            'kovo' => $values['kovo'],
            'koe' => $values['koe'],
            'kool' => $values['kool'],
            'korl' => $values['korl'],
            'dekgroepen' => array_map(function($dekgroep) {
                return [
                    ':ewe_count' => $dekgroep['ewe_count'],
                    ':rammen' => $dekgroep['rammen']
                ];
            }, $values['dekgroepen']),
            'remarks' => $values['remarks']
        ]);

        $date_sent = Utils::now_utc();
        $db->execute('
            INSERT INTO `dekverklaringen` (`user_id`, `season`, `studbook`, `date_sent`, `pdf_uuid`, `json`) 
            VALUES (:user_id, :season, :studbook, :date_sent, :pdf_uuid, :json)
        ', [
            ':user_id' => $user['id'],
            ':season' => $values['season'],
            ':studbook' => $values['studbook'],
            ':date_sent' => Utils::format_datetime_for_mysql($date_sent),
            ':pdf_uuid' => $uuid,
            ':json' => $json
        ]);

        return [
            'success' => true,
            'id' => $db->lastInsertId()
        ];
    });

    $r->addRoute('GET', 'api/dekverklaringen/{id:\d+}', function($para, $values) use ($db, $user, $file_storage) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        // Get the dekverklaring
        $row = $db->querySingle("
            SELECT `season`, `studbook`, `pdf_uuid`
            FROM `dekverklaringen`
            WHERE id = :id
            AND user_id = :user_id
        ", [
            ':id' => intval($id),
            ':user_id' => $user['id']
        ]);
        if(!$row) {
            return [
                'success' => false,
                'reason' => 'DEKVERKLARING_NOT_FOUND'
            ];
        }
        
        $pdf_uuid = $row['pdf_uuid'];
        $path = $file_storage . DIRECTORY_SEPARATOR . $pdf_uuid . ".pdf";

        header('Content-Type: application/pdf');
        header('Content-Length: ' . filesize($path));

        if(isset($_GET['download'])) {
            header('Content-Disposition: attachment; filename="Dekverklaring ' . $row['season'] . ' ' . Utils::ras_num_to_str($row['studbook']) . '.pdf"');
        }

        readfile($path);
        return null;
    });

    $r->addRoute('GET', 'api/huiskeuringen', function($_, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        // Count total number of users
        $row = $db->querySingle("
            SELECT COUNT(1) AS `cnt`
            FROM `huiskeuringen`
            WHERE user_id = :user_id
        ", [
            ':user_id' => $user['id']
        ]);
        $totalCount = $row['cnt'];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $rows = $db->queryAll("
            SELECT `id`, `year`, `studbook`, `region`, `preferred_date`, `date_sent`
            FROM `huiskeuringen`
            WHERE `user_id` = :user_id
            LIMIT :limit
            OFFSET :skip
        ", [
            ':limit' => $pageSize,
            ':skip' => $page * $pageSize,
            ":user_id" => $user['id']
        ]);

        return [
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'year' => $row['year'],
                    'studbook' => $row['studbook'],
                    'region' => $row['region'],
                    'preferred_date' => $row['preferred_date'] == null 
                        ? null
                        : Utils::format_datetime_for_json(Utils::parse_date_from_mysql($row['preferred_date'])),
                    "date_sent" => Utils::format_datetime_for_json(Utils::parse_datetime_from_mysql($row['date_sent']))
                ];
            }, $rows)
        ];
    });

    $r->addRoute('GET', 'api/huiskeuringen/{id:\d+}', function($para, $values) use ($db, $user, $file_storage) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        $row = $db->querySingle("
            SELECT `year`, `studbook`, `pdf_uuid`
            FROM `huiskeuringen`
            WHERE id = :id
              AND user_id = :user_id
        ", [
            ':id' => intval($id),
            ':user_id' => $user['id']
        ]);

        if(!$row) {
            return [
                'success' => false,
                'reason' => 'HUISKEURING_NOT_FOUND'
            ];
        }

        $pdf_uuid = $row['pdf_uuid'];
        $path = $file_storage . DIRECTORY_SEPARATOR . $pdf_uuid . ".pdf";

        header('Content-Type: application/pdf');
        header('Content-Length: ' . filesize($path));

        if(isset($_GET['download'])) {
            header('Content-Disposition: attachment; filename="Huiskeuring ' . $row['year'] . ' ' . Utils::ras_num_to_str($row['studbook']) . '.pdf"');
        }

        readfile($path);
        return null;
    });

    $r->addRoute('POST', 'api/huiskeuringen', function($_, $values) use ($db, $user, $file_storage) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        function parse_region($region) {
            switch($region) {
                case 0: return "Noord (Drenthe / Friesland / Groningen)";
                case 1: return "Oost (Gelderland / Overijssel / Flevoland)";
                case 2: return "West (Utrecht / Zuid-Holland / Noord-Holland)";
                case 3: return "Zuid (Limburg / Noord-Braband / Zeeland / België)";
                case -1: return "Overig - Zie opmerking";
            }
        }

        function parse_preferred_date($region, $num) {
            if($region == -1 || $num == -1) 
                return null;

            $dates = array(
                array(
                    date_date_set(new \DateTime(), 2021, 6, 18),
                    date_date_set(new \DateTime(), 2021, 6, 19),
                    date_date_set(new \DateTime(), 2021, 6, 20),
                    date_date_set(new \DateTime(), 2021, 8, 20),
                    date_date_set(new \DateTime(), 2021, 8, 21),
                    date_date_set(new \DateTime(), 2021, 8, 22)
                ),
                array(
                    date_date_set(new \DateTime(), 2021, 6, 26),
                    date_date_set(new \DateTime(), 2021, 7, 25)
                ),
                array(
                    date_date_set(new \DateTime(), 2021, 7, 4),
                    date_date_set(new \DateTime(), 2021, 7, 31)
                ),
                array(
                    date_date_set(new \DateTime(), 2021, 7, 10),
                    date_date_set(new \DateTime(), 2021, 8, 8)
                )
            );

            return $dates[$region][$num];
        }

        // TODO: validate input json

        $preferred_date = parse_preferred_date($values['region'], $values['preferred_date']);

        $lh = 6;
        $cl = 70;
      
        $pdf = new FPDF();
        $pdf->SetMargins(15, 15, 15);
        $pdf->AddPage();
        $pdf->SetFont('Arial','B',16);
      
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->SetXY(-40, 15);
        $pdf->Image("./lib/nfdh_logo.png");
        $pdf->SetXY($x, $y);
      
        $pdf->Write($lh, 'Aanmelding huiskeuring');
        $pdf->Ln($lh);
        $pdf->SetFont('Arial','I', 11);
        setlocale(LC_TIME, "nl_NL");
        $pdf->Write($lh, Utils::format_date(Utils::now_utc(), "%A %e %B %Y %H:%M"));
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial','',12);
        $pdf->Cell($cl, $lh, "Naam:");
        $pdf->Write($lh, $values['name']);

        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Stamboek:");
        $pdf->Write($lh, Utils::ras_num_to_str($values['studbook']));
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Regio:");
        $pdf->Write($lh, parse_region($values['region']));
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Locatie, indien afwijkend:");
        $pdf->Write($lh, $values['location']);
        $pdf->Ln($lh);
      
        if($values['region'] != -1) {
          $pdf->Cell($cl, $lh, "Datum:");
          if($preferred_date == null) {
            $pdf->Write($lh, "Geen voorkeur");
          }
          else {
            $pdf->Write($lh, Utils::format_date($preferred_date, "%e %B"));
          }
          $pdf->Ln($lh);
        }
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Aantal rammen eerste keuring:");
        $pdf->Write($lh, $values['rams_first']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Aantal rammen herkeuring:");
        $pdf->Write($lh, $values['rams_second']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Aantal ooien:");
        $pdf->Write($lh, $values['ewes']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Aantal locaties:");
        $pdf->Write($lh, $values['num_locations']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Stamboekbewijs:");
        $pdf->Write($lh, $values['on_paper'] ? "Ja" : "Nee");
      
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Write($lh, "Opmerking");
        $pdf->SetFont('Arial','',12);
        $pdf->Ln($lh);
        $pdf->Write($lh, $opmerking);

        $uuid = Uuid::generate();
        $pdf_path = $file_storage . DIRECTORY_SEPARATOR . $uuid . ".pdf";
        $pdf->Output('F', $pdf_path);

        $date_sent = Utils::now_utc();  

        $json = json_encode([
            'year' => intval($date_sent->format('Y')),
            'name' => $values['name'],
            'studbook' => $values['studbook'],
            'region' => $values['region'],
            'location' => $values['location'],
            'preferred_date' => $preferred_date == null ? null : Utils::format_date_for_mysql($preferred_date),
            'rams_first' => $values['rams_first'],
            'rams_second' => $values['rams_second'],
            'ewes' => $values['ewes'],
            'num_locations' => $values['num_locations'],
            'on_paper' => $values['on_paper'],
            'remarks' => $values['remarks']
        ]);
     
        $db->execute("
            INSERT INTO `huiskeuringen` (
                `user_id`, `year`, `studbook`, `region`, `preferred_date`, `date_sent`, `pdf_uuid`, `json`
            )
            VALUES (
                :user_id, :year, :studbook, :region, :preferred_date, :date_sent, :pdf_uuid, :json
            )
        ", [
            ':user_id' => $user['id'],
            ':year' => intval($date_sent->format('Y')),
            ':studbook' => $values['studbook'],
            ':region' => $values['region'],
            ':preferred_date' => $preferred_date == null ? null : Utils::format_date_for_mysql($preferred_date),
            ':date_sent' => Utils::format_datetime_for_mysql($date_sent),
            ':pdf_uuid' => $uuid,
            ':json' => $json
        ]);

        return [
            "success" => true,
            "id" => $db->lastInsertId()
        ];
    });
});

// Fetch method and URI from somewhere
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Strip query string (?foo=bar) and decode URI
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

// Remove leading slash
if($uri[0] === '/') {
    $uri = substr($uri, 1);
}

// Parse input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        $allowedMethods = $routeInfo[1];
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        
        $result = $handler($vars, $input);

        if($result != null) {
            header('Content-type: application/json');
            echo json_encode($result);
        }
        break;
}