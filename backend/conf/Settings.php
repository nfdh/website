<?php
namespace Conf;

// Load local settings if present
if(\file_exists(__DIR__ . "/Settings.local.php")) {
    include(__DIR__ . "/Settings.local.php");
}
else {
    class Settings {
        static $conf  = [
            'db_server' => '#{DB_HOST}#',
            'db_username' => '#{DB_USERNAME}#',
            'db_password' => '#{DB_PASSWORD}#',
            'db_database' => '#{DB_DATABASE}#'
        ];

        static function get() {
            return Settings::$conf;
        }
    }
}