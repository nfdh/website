<?php

use Lib\Utils;
use Lib\Results\JSON;
use Lib\Results\File;

function register_signup_routes(FastRoute\RouteCollector $r, \Lib\Database $db, $user, \Lib\MailerFactory $mailer_factory, string $file_storage, $mail_targets) {
    $r->addRoute('POST', 'api/signup', function($_, $values) use ($db, $user, $mailer_factory, $file_storage, $mail_targets) {
        // TODO: Properly validate input json

        function parse_membershipType($type) {
            switch($type) {
                case 0: return 'Donateur';
                case 1: return 'Basislidmaatschap';
                case 2: return 'Stamboeklidmaatschap';
                case 3: return 'Kudde';
                case 4: return 'Gezinslidmaatschap';
            }
        }

        function parse_zwoegervrij($zwoegerVrij) {
            switch($zwoegerVrij) {
                case 0: return 'Ja';
                case 1: return 'Nee';
                case 2: return 'Niet van toepassing';
            }
        }

        function parse_studbook($studbook) {
            switch($studbook) {
                case 0: return 'Drents Heideschaap';
                case 1: return 'Schoonebeeker';
            }
        }

        function parse_sheep_gender($gender) {
            switch($gender) {
                case 0: return 'Ram';
                case 1: return 'Ooi';
            }
        }

        function parse_registered($registered) {
            switch($registered) {
                case 0: return 'Ja';
                case 1: return 'Nee';
                case 2: return 'Niet bekend';
            }
        }

        // Create PDF
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

        $pdf->Write($lh, 'Inschrijving');
        $pdf->Ln($lh);
        $pdf->SetFont('Arial','I', 11);
        $pdf->Write($lh, Utils::format_date(new \DateTime("now"), "%A %e %B %Y %H:%M"));
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial','',12);
        $pdf->Cell($cl, $lh, "Volledige naam incl. voorletters:");
        $pdf->Write($lh, $values['fullName']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Voornaam:");
        $pdf->Write($lh, $values['firstName']);
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Write($lh, "Adres");
        $pdf->SetFont('Arial','',12);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Straat en huisnummer:");
        $pdf->Write($lh, $values['address']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Postcode:");
        $pdf->Write($lh, $values['postalCode']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Woonplaats:");
        $pdf->Write($lh, $values['city']);
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Write($lh, "Contactinformatie");
        $pdf->SetFont('Arial','',12);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "E-mail adres:");
        $pdf->Write($lh, $values['email']);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Telefoon- of mobielnummer:");
        $pdf->Write($lh, $values['phoneNumber']);
        $pdf->Ln($lh * 2);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Write($lh, "Lidmaatschap");
        $pdf->SetFont('Arial','',12);
        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Soort:");

        $membershipType = $values['membershipType'];
        $pdf->Write($lh, parse_membershipType($membershipType));

        $jsonObj = [
            'fullName' => $values['fullName'],
            'firstName' => $values['firstName'],
            'address' => $values['address'],
            'postalCode' => $values['postalCode'],
            'city' => $values['city'],
            'email' => $values['email'],
            'phoneNumber' => $values['phoneNumber'],
            'membershipType' => $values['membershipType']
        ];

        if($membershipType == 0) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Bedrag:");
            $pdf->Write($lh, chr(128) . number_format($values['amount'], 2));

            $jsonObj['amount'] = $values['amount'];
        }
        else if($membershipType == 4) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "In hetzelfde gezin als:");
            $pdf->Write($lh, $values['familyMember']);

            $jsonObj['familyMember'] = $values['familyMember'];
        }

        if($membershipType >= 2 && $membershipType < 4) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "UBN nummer:");
            $pdf->Write($lh, $values['ubn']);

            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, 'RVO relatienummer:');
            $pdf->write($lh, $values['rvoRelationNumber']);

            $jsonObj['ubn'] = $values['ubn'];
            $jsonObj['rvoRelationNumber'] = $values['rvoRelationNumber'];
        }

        if($membershipType == 3) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Gecertificeerd zwoegervrij:");
            $pdf->Write($lh, parse_zwoegervrij($values['zwoegerVrij']));
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Gemotiveerd verzoek:");
            $pdf->Write($lh, $values['herdDscription']);

            $jsonObj['zwoegerVrij'] = $values['zwoegerVrij'];
            $jsonObj['herdDscription'] = $values['herdDscription'];
        }

        $pdf->Ln($lh);
        $pdf->Cell($cl, $lh, "Akkoord met het privacybeleid:");
        $pdf->Write($lh, "Ja");

        $uuid = \Lib\Uuid::generate();
        $pdf_path = $file_storage . DIRECTORY_SEPARATOR . $uuid . ".pdf";

        $pdf->Output('F', $pdf_path);

        // Generate CSV with sheep information
        $csv_path = false;
        if($membershipType == 2) {
            $csv_path = $file_storage . DIRECTORY_SEPARATOR . $uuid . ".csv";
            $csv = fopen($csv_path, "w");
            fputcsv($csv, ['Ras', 'Ram/ooi', 'Levensnummer', 'Geboortedatum', 'Aankoopdatum', 'UBN verkoper', 'Reeds stamboek geregistreerd'], ";");

            $studbookJsonObj = [];

            foreach($values['studbooks'] as $studbook) {
                $sheepJsonObj = [];
                $studbookName = parse_studbook($studbook['studbook']);

                foreach($studbook['sheep'] as $sheep) {
                    $birthDate = Utils::parse_datetime_from_json($sheep['birthdate']);
                    $dateOfPurchase = $sheep['dateOfPurchase'] == null ? null : Utils::parse_datetime_from_json($sheep['dateOfPurchase']);

                    fputcsv($csv, [
                        $studbookName,
                        parse_sheep_gender($sheep['gender']),
                        $sheep['number'],
                        Utils::format_date($birthDate, "%d-%m-%Y"),
                        $dateOfPurchase == null ? '' : Utils::format_date($dateOfPurchase, "%d-%m-%Y"),
                        $sheep['ubnOfSeller'] == null ? '' : $sheep['ubnOfSeller'],
                        parse_registered($sheep['registeredInStudbook'])
                    ], ";");

                    $sheepJsonObj[] = [
                        "gender" => $sheep['gender'],
                        "number" => $sheep['number'],
                        "birthDate" => Utils::format_datetime_for_json($birthDate),
                        "registeredInStudbook" => $sheep['registeredInStudbook'],
                        "dateOfPurchase" => $dateOfPurchase == null ? null : Utils::format_datetime_for_json($dateOfPurchase),
                        "ubnOfSeller" => $sheep['ubnOfSeller']
                    ];
                }

                $studbookJsonObj[] = [
                    "studbook" => $studbook['studbook'],
                    "sheep" => $sheepJsonObj
                ];
            }

            $jsonObj['studbooks'] = $studbookJsonObj;

            fclose($csv);
        }

        // Send mail to ledenadministratie
        $escaped_name = htmlspecialchars($values['fullName']);
        $body = "<p>Beste ledenadministratie,</p>";
        $body .= "<p>$escaped_name heeft een aanmelding verstuurd via de website. Detailgegevens zijn als bijlage toegevoegd aan deze e-mail.</p>";
        $body .= "<p>Dit is een geautomatiseerd e-mail bericht, antwoorden op deze mail worden niet gelezen.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap</p>";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Aanmelding ' . $values['fullName'];
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($mail_targets['member_administration']);

        $safe_fullName = preg_replace("/[^a-zA-Z0-9_]/i", " ", $values['fullName']);
        $mailer->AddAttachment($pdf_path, "Aanmelding $safe_fullName.pdf");
        if($csv_path) {
            $mailer->AddAttachment($csv_path, "Stallijst $safe_fullName.csv");
        }
        $mailer->Send();

        // Add to signups table
        $json = json_encode($jsonObj);
        $date_sent = Utils::now_utc();  

        $db->execute("
            INSERT INTO `signups` (
                `name`, `email`, `membership_type`, `date_sent`, `pdf_uuid`, `json`
            )
            VALUES (
                :name, :email, :membership_type, :date_sent, :pdf_uuid, :json
            )
        ", [
            ':name' => $values['fullName'],
            ':email' => $values['email'],
            ':membership_type' => $values['membershipType'],
            ':date_sent' => Utils::format_datetime_for_mysql($date_sent),
            ':pdf_uuid' => $uuid,
            ':json' => $json
        ]);

        // Send mail to user themselves
        $escaped_name = htmlspecialchars($values['firstName']);
        $body = "<p>Hallo $escaped_name,</p>";
        $body .= "<p>Wij hebben uw aanmelding ontvangen. Deze is ter referentie ook als bijlage toegevoegd aan deze e-mail.</p>";
        $body .= "<p>Iemand van ledenadministratie zal op korte termijn contact met u opnemen om de aanmelding te voltooien.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap</p>";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Aanmelding ontvangen';
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($values['email']);
        $mailer->AddReplyTo($mail_targets['member_administration'], "Ledenadministratie");

        $mailer->AddAttachment($pdf_path, "Aanmelding $safe_fullName.pdf");
        if($csv_path) {
            $mailer->AddAttachment($csv_path, "Stallijst $safe_fullName.csv");
        }
        $mailer->Send();

        return new JSON([
            "success" => true
        ]);
    });

    $r->addRoute('GET', 'api/signups', function($para, $values) use ($db, $user) {
        if(!$user || !$user['role_member_administrator']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        // Count total number of users
        $row = $db->querySingle("
            SELECT COUNT(1) AS `cnt`
            FROM `signups`
        ", []);
        $totalCount = $row['cnt'];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $rows = $db->queryAll("
            SELECT `id`, `name`, `email`, `membership_type`, `date_sent`
            FROM `signups`
            ORDER BY `date_sent` DESC
            LIMIT :limit
            OFFSET :skip
        ", [
            ':limit' => $pageSize,
            ':skip' => $page * $pageSize
        ]);

        return new JSON([
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "membershipType" => $row['membership_type'],
                    "date_sent" => Utils::format_datetime_for_json(Utils::parse_datetime_from_mysql($row['date_sent']))
                ];
            }, $rows)
        ]);
    });

    $r->addRoute('GET', 'api/signups/{id:\d+}', function($para, $values) use ($db, $user, $file_storage) {
        if(!$user || !$user['role_member_administrator']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        $id = $para['id'];

        $row = $db->querySingle("
            SELECT `name`, `email`, `membership_type`, `date_sent`
            FROM `signups`
            WHERE id = :id
        ", [
            ':id' => intval($id)
        ]);

        if(!$row) {
            return new JSON([
                'success' => false,
                'reason' => 'SIGNUP_NOT_FOUND'
            ]);
        }

        return new JSON([
            'success' => true,
            'signup' => [
                "name" => $row['name'],
                "email" => $row['email'],
                "membershipType" => $row['membership_type'],
                "date_sent" => Utils::format_datetime_for_json(Utils::parse_datetime_from_mysql($row['date_sent']))
            ]
        ]);
    });

    $r->addRoute('GET', 'api/signups/{id:\d+}/form', function($para, $values) use ($db, $user, $file_storage) {
        if(!$user || !$user['role_member_administrator']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        $id = $para['id'];

        $row = $db->querySingle("
            SELECT `name`, `pdf_uuid`
            FROM `signups`
            WHERE id = :id
        ", [
            ':id' => intval($id)
        ]);

        if(!$row) {
            return new JSON([
                'success' => false,
                'reason' => 'SIGNUP_NOT_FOUND'
            ]);
        }

        $pdf_uuid = $row['pdf_uuid'];
        $path = $file_storage . DIRECTORY_SEPARATOR . $pdf_uuid . ".pdf";

        $downloadName = null;
        if(isset($_GET['download'])) {
            $downloadName = 'Aanmelding ' . $row['name'] . ".pdf";
        }

        return new File($path, "application/pdf", $downloadName);
    });

    $r->addRoute('GET', 'api/signups/{id:\d+}/sheeplist', function($para, $values) use ($db, $user, $file_storage) {
        if(!$user || !$user['role_member_administrator']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        $id = $para['id'];

        $row = $db->querySingle("
            SELECT `name`, `pdf_uuid`
            FROM `signups`
            WHERE id = :id
        ", [
            ':id' => intval($id)
        ]);

        if(!$row) {
            return new JSON([
                'success' => false,
                'reason' => 'SIGNUP_NOT_FOUND'
            ]);
        }

        $pdf_uuid = $row['pdf_uuid'];
        $path = $file_storage . DIRECTORY_SEPARATOR . $pdf_uuid . ".csv";

        $downloadName = null;
        if(isset($_GET['download'])) {
            $downloadName = 'Stallijst ' . $row['name'] . ".csv";
        }

        return new File($path, "text/csv", $downloadName);
    });
}