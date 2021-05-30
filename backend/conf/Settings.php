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
                'location' => 'nieuw.drentsheideschaap.nl'
            ],
            'mail' => [
                'from_address' => 'noreply@drentsheideschaap.nl',
                'from_name' => 'Nederlandse Fokkersvereniging Het Drentse Heideschaap'
            ],
            'url' => 'https://nieuw.drentsheideschaap.nl',
            'file_storage' => './files'
        ];

        static function get() {
            return Settings::$conf;
        }
    }
}