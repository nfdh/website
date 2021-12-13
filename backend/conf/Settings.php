<?php
namespace Conf;

// Load local settings if present
if(\file_exists(__DIR__ . "/Settings.local.php")) {
    include(__DIR__ . "/Settings.local.php");
}
else {
    class Settings {
        static $conf  = [
            'db' => [
                'server' => '#{DB_HOST}#',
                'username' => '#{DB_USERNAME}#',
                'password' => '#{DB_PASSWORD}#',
                'database' => '#{DB_DATABASE}#',
            ],
            'appInsights' => [
                'instrumentationKey' => '46da6ab2-ce36-48bf-9a04-5759a5f23d45',
                'location' => 'drentsheideschaap.nl'
            ],
            'mail' => [
                'from_address' => 'noreply@drentsheideschaap.nl',
                'from_name' => 'Nederlandse Fokkersvereniging Het Drentse Heideschaap'
            ],
            'url' => 'https://drentsheideschaap.nl',
            'file_storage' => '/data/sites/web/drentsheideschaapnl/files',
            'mail_targets' => [
                // Use temporary e-mails
                'member_administration' => 'penningmeester@nfdh.nl',
                'studbook_administration' => 'stamboek@nfdh.nl',
                'website_management' => 'website@nfdh.nl'
            ]
        ];

        static function get() {
            return Settings::$conf;
        }
    }
}