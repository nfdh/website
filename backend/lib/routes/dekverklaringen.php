<?php

use Lib\Utils;
use Lib\Uuid;
use Lib\Results\JSON;
use Lib\Results\File;

function register_dekverklaringen_routes(FastRoute\RouteCollector $r, \Lib\Database $db, $user, \Lib\MailerFactory $mailer_factory, string $file_storage, $mail_targets) {
    $r->addRoute('GET', 'api/dekverklaringen', function($para, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
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
            ORDER BY `date_sent` DESC
            LIMIT :limit
            OFFSET :skip
        ", [
            ':limit' => $pageSize,
            ':skip' => $page * $pageSize,
            ':user_id' => $user['id']
        ]);

        return new JSON([
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
        ]);
    });

    $r->addRoute('POST', 'api/dekverklaringen', function($_, $values) use ($db, $user, $mailer_factory, $file_storage, $mail_targets) {
        if(!$user) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
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

        $has_ko = false;
        switch($values['studbook']) {
            case 0: $has_ko = $user['studbook_heideschaap_ko']; break;
            case 1: $has_ko = $user['studbook_schoonebeeker_ko']; break;
        }

        $pdf->Cell($cl, $lh, "KO kudde:");
        $pdf->Write($lh, $has_ko ? "Ja" : "Nee");
        $pdf->Ln($lh);

        $pdf->Cell($cl, $lh, "Ras:");
        $pdf->Write($lh, Utils::ras_num_to_str($values['studbook']));

        if($has_ko) {
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
            
        // Send mail to stamboekadministratie
        $fokker_escaped = htmlspecialchars($user['name']);
        $body = "<p>Hallo,</p>";
        $body .= "<p>Fokker $fokker_escaped heeft een dekverklaring ingedient via de website <a href=\"https://drentsheideschaap.nl\">https://drentsheideschaap.nl</a>.<br/>De dekverklaring is als bijlage toegevoegd aan deze e-mail.</p>";
        $body .= "<p>Dit is een geautomatiseerd e-mail bericht, antwoorden op deze mail worden niet gelezen.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Dekverklaring ' . $values['name'];
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($mail_targets['studbook_administration']);

        $safe_fullName = preg_replace("/[^a-zA-Z0-9_]/i", " ", $values['name']);
        $mailer->AddAttachment($pdf_path, "Dekverklaring $safe_fullName.pdf");
        $mailer->Send();

        // Add to dekverklaring table
        $json_obj = [
            'season' => $values['season'],
            'studbook' => $values['studbook'],
            'name' => $values['name'],
            'dekgroepen' => array_map(function($dekgroep) {
                return [
                    ':ewe_count' => $dekgroep['ewe_count'],
                    ':rammen' => $dekgroep['rammen']
                ];
            }, $values['dekgroepen']),
            'remarks' => $values['remarks']
        ];

        if($has_ko) {
            $json_obj = array_merge($json_obj, [
                'kovo' => $values['kovo'],
                'koe' => $values['koe'],
                'kool' => $values['kool'],
                'korl' => $values['korl']
            ]);
        }

        $json = json_encode($json_obj);

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

        // Send mail to user themselves
        $body = "<p>Hallo,</p>";
        $body .= "<p>U heeft een dekverklaring ingedient via de website <a href=\"https://drentsheideschaap.nl\">https://drentsheideschaap.nl</a>.<br/>De dekverklaring is als bijlage toegevoegd aan deze e-mail.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Dekverklaring verstuurd';
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($user['email']);
        $mailer->AddReplyTo($mail_targets['studbook_administration'], "Stamboekadministratie");

        $mailer->AddAttachment($pdf_path, "Dekverklaring $safe_fullName.pdf");
        $mailer->Send();

        return new JSON([
            'success' => true,
            'id' => $db->lastInsertId()
        ]);
    });

    $r->addRoute('GET', 'api/dekverklaringen/{id:\d+}', function($para, $values) use ($db, $user, $file_storage) {
        if(!$user) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
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
            return new JSON([
                'success' => false,
                'reason' => 'DEKVERKLARING_NOT_FOUND'
            ]);
        }
        
        $pdf_uuid = $row['pdf_uuid'];
        $path = $file_storage . DIRECTORY_SEPARATOR . $pdf_uuid . ".pdf";

        $downloadName = null;
        if(isset($_GET['download'])) {
            $downloadName = 'Dekverklaring ' . $row['season'] . ' ' . Utils::ras_num_to_str($row['studbook']) . '.pdf';
        }
        return new File($path, "application/pdf", $downloadName);
    });
}