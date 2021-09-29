<?php

use Lib\Utils;
use Lib\Results\JSON;

function register_signup_routes(FastRoute\RouteCollector $r, \Lib\Database $db, $user, \Lib\MailerFactory $mailer_factory, string $file_storage, $mail_targets) {
    $r->addRoute('POST', 'api/signup', function($_, $values) use ($db, $user, $mailer_factory, $file_storage, $mail_targets) {
        // TODO: Properly validate input json

        function parse_membershipType($type) {
            switch($type) {
                case 0: return 'Donateur';
                case 1: return 'Basislidmaatschap';
                case 2: return 'Stamboeklidmaatschap';
                case 3: return 'Kudde';
            }
        }

        function parse_zwoegervrij($zwoegerVrij) {
            switch($zwoegerVrij) {
                case 0: return 'Ja';
                case 1: return 'Nee';
                case 2: return 'Niet van toepassing';
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

        if($membershipType == 0) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Bedrag:");
            $pdf->Write($lh, '€' . number_format($values['amount'], 2));
        }
        else if($membershipType == 1) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Familielid:");
            $pdf->Write($lh, $values['familyMembership'] == true ? "Ja" : "Nee");
        }

        if($membershipType >= 2) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "UBN nummer:");
            $pdf->Write($lh, $values['ubn']);
        }

        if($membershipType == 3) {
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Gecertificeerd zwoegervrij:");
            $pdf->Write($lh, parse_zwoegervrij($values['zwoegerVrij']));
            $pdf->Ln($lh);
            $pdf->Cell($cl, $lh, "Gemotiveerd verzoek:");
            $pdf->Write($lh, $values['herdDscription']);
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
            fputcsv($csv, ['Ram/ooi', 'Levensnummer', 'Geboortedatum', 'Aankoopdatum', 'UBN verkoper', 'Reeds stamboek geregistreerd']);

            foreach($values['sheep'] as $sheep) {
                $birthDate = Utils::parse_datetime_from_json($sheep['birthdate']);
                $dateOfPurchase = $sheep['dateOfPurchase'] == null ? null : Utils::parse_datetime_from_json($sheep['dateOfPurchase']);

                fputcsv($csv, [
                    parse_sheep_gender($sheep['gender']),
                    $sheep['number'],
                    Utils::format_date($birthDate, "%d-%m-%Y"),
                    $dateOfPurchase == null ? '' : Utils::format_date($dateOfPurchase, "%d-%m-%Y"),
                    $sheep['ubnOfSeller'] == null ? '' : $sheep['ubnOfSeller'],
                    parse_registered($sheep['registeredInStudbook'])
                ]);
            }

            fclose($csv);
        }

        // Send mail to ledenadministratie
        $escaped_name = htmlspecialchars($values['fullName']);
        $body = "<p>Beste ledenadministratie,</p>";
        $body .= "<p>$escaped_name heeft een aanmelding verstuurd via de website. Detailgegevens zijn als bijlage toegevoegd aan deze e-mail.</p>";
        $body .= "<p>Met vriendelijke groeten,<br/>Nederlandse Fokkersvereniging Het Drentse Heideschaap</p>";

        $mailer = $mailer_factory->create();
        $mailer->Subject   = 'Aanmelding ' . $values['fullName'];
        $mailer->Body      = $body;
        $mailer->IsHTML(true);
        $mailer->AddAddress($values['email']);
        $mailer->AddReplyTo($mail_targets['signup'], "Ledenadministratie");

        $safe_fullName = preg_replace("/[^a-zA-Z0-9_]/i", " ", $values['fullName']);
        $mailer->AddAttachment($pdf_path, "Aanmelding $safe_fullName.pdf");
        if($csv_path) {
            $mailer->AddAttachment($csv_path, "Stallijst $safe_fullName.csv");
        }
        $mailer->Send();

        // Send mail to user itself
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
        $mailer->AddReplyTo($mail_targets['signup'], "Ledenadministratie");

        $mailer->AddAttachment($pdf_path, "Aanmelding $safe_fullName.pdf");
        if($csv_path) {
            $mailer->AddAttachment($csv_path, "Stallijst $safe_fullName.csv");
        }
        $mailer->Send();

        return new JSON([
            "success" => true
        ]);
    });
}