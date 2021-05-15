<?php
namespace Lib;

use \PHPMailer\PHPMailer\PHPMailer;
use \PHPMailer\PHPMailer\Exception;

class MailerFactory {
    private $from_address;
    private $from_name;

    function __construct($conf) {
        $this->from_address = $conf['from_address'];
        $this->from_name = $conf['from_name'];
    }

    function create(): PHPMailer {
        $mailer = new PHPMailer(true);
        $mailer->SetFrom($this->from_address, $this->from_name);
        return $mailer;
    }
}