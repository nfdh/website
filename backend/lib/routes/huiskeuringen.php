<?php

use Lib\Utils;
use Lib\Uuid;
use Lib\Results\JSON;
use Lib\Results\File;

function register_huiskeuringen_routes(FastRoute\RouteCollector $r, \Lib\Database $db, $user, \Lib\MailerFactory $mailer_factory, string $file_storage, $mail_targets) {
    $r->addRoute('GET', 'api/huiskeuringen', function($_, $values) use ($db, $user) {
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
            ORDER BY `date_sent` DESC
            LIMIT :limit
            OFFSET :skip
        ", [
            ':limit' => $pageSize,
            ':skip' => $page * $pageSize,
            ":user_id" => $user['id']
        ]);

        return new JSON([
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
        ]);
    });

    $r->addRoute('GET', 'api/huiskeuringen/{id:\d+}', function($para, $values) use ($db, $user, $file_storage) {
        if(!$user) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
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
            return new JSON([
                'success' => false,
                'reason' => 'HUISKEURING_NOT_FOUND'
            ]);
        }

        $pdf_uuid = $row['pdf_uuid'];
        $path = $file_storage . DIRECTORY_SEPARATOR . $pdf_uuid . ".pdf";

        $downloadName = null;
        if(isset($_GET['download'])) {
            $downloadName = 'Huiskeuring ' . $row['year'] . ' ' . Utils::ras_num_to_str($row['studbook']) . '.pdf"';
        }

        return new File($path, "application/pdf", $downloadName);
    });

    $r->addRoute('POST', 'api/huiskeuringen', function($_, $values) use ($db, $user, $mailer_factory, $file_storage, $mail_targets) {
        if(!$user) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        function parse_region($region) {
            switch($region) {
                case 0: return "Noord (Drenthe / Friesland / Groningen)";
                case 1: return "Oost (Gelderland / Overijssel / Flevoland)";
                case 2: return "West (Utrecht / Zuid-Holland / Noord-Holland)";
                case 3: return "Zuid (Limburg / Noord-Brabant / Zeeland / België)";
                case -1: return "Overig - Zie opmerking";
            }
        }

        function parse_preferred_date($region, $num) {
            if($region == -1 || $num == -1) 
                return null;

            $dates = array(
                array(
                    date_date_set(new \DateTime(), 2024, 6, 21),
                    date_date_set(new \DateTime(), 2024, 6, 22),
                    date_date_set(new \DateTime(), 2024, 6, 23),
                    date_date_set(new \DateTime(), 2024, 8, 23),
                    date_date_set(new \DateTime(), 2024, 8, 24),
                    date_date_set(new \DateTime(), 2024, 8, 25)
                ),
                array(
                    date_date_set(new \DateTime(), 2024, 6, 29),
                    date_date_set(new \DateTime(), 2024, 7, 28)
                ),
                array(
                    date_date_set(new \DateTime(), 2024, 7, 7),
                    date_date_set(new \DateTime(), 2024, 8, 3)
                ),
                array(
                    date_date_set(new \DateTime(), 2024, 7, 13),
                    date_date_set(new \DateTime(), 2024, 8, 11)
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
        $pdf->Write($lh, boolval($values['on_paper']) ? "Ja" : "Nee");
      
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
        $body .= "<p>Fokker $fokker_escaped heeft zich aangemeld voor een huiskeuring via de website <a href=\"https://drentsheideschaap.nl\">https://drentsheideschaap.nl</a>.<br/>De aanmelding is als bijlage toegevoegd aan deze e-mail.</p>";
        $body .= "<p>Dit is een geautomatiseerd e-mail bericht, antwoorden op deze mail worden niet gelezen.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Aanmelding huiskeuring ' . $values['name'];
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($mail_targets['studbook_administration']);

        $safe_fullName = preg_replace("/[^a-zA-Z0-9_]/i", " ", $values['name']);
        $mailer->AddAttachment($pdf_path, "Aanmelding $safe_fullName.pdf");
        $mailer->Send();

        // Store in huiskeuringen table
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
            'on_paper' => boolval($values['on_paper']),
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

        // Send mail to user themselves
        $body = "<p>Hallo,</p>";
        $body .= "<p>U heeft zich aangemeld voor een huiskeuring via de website <a href=\"https://drentsheideschaap.nl\">https://drentsheideschaap.nl</a>.<br/>De aanmelding is als bijlage toegevoegd aan deze e-mail.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Aanmelding verstuurd';
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($user['email']);
        $mailer->AddReplyTo($mail_targets['studbook_administration'], "Stamboekadministratie");

        $mailer->AddAttachment($pdf_path, "Aanmelding $safe_fullName.pdf");
        $mailer->Send();

        return new JSON([
            "success" => true,
            "id" => $db->lastInsertId()
        ]);
    });
}