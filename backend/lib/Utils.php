<?php
namespace Lib;

class Utils {
    public static function ras_num_to_str(string $str) {
        if($str == 0) {
            return "Drents Heideschaap";
        }
        else if($str == 1) {
            return "Schoonebeeker";
        }
        else {
            exit;
        }
    }

    public static function format_date(\DateTime $date, string $format) {
        setlocale(LC_TIME, "nl_NL");
        date_default_timezone_set("Europe/Amsterdam");

        return strftime($format, $date->getTimestamp());
    }

    public static function format_datetime_for_json(\DateTime $date) {
        return $date->format(\DateTime::ISO8601);
    }

    public static function parse_datetime_from_json(string $date) {
        return \DateTime::createFromFormat("Y-m-d\TH:i:s.v\Z", $date, new \DateTimeZone("UTC"));
    }

    public static function format_datetime_for_mysql(\DateTime $date) {
        return $date->format('Y-m-d H:i:s');
    }

    public static function parse_datetime_from_mysql(string $date) {
        return \DateTime::createFromFormat('Y-m-d H:i:s', $date, new \DateTimeZone("UTC"));
    }

    public static function format_date_for_mysql(\DateTime $date) {
        return $date->format('Y-m-d');
    }

    public static function parse_date_from_mysql(string $date) {
        return \DateTime::createFromFormat('Y-m-d', $date, new \DateTimeZone("UTC"))->setTime(0, 0, 0);
    }

    public static function now_utc() {
        return new \DateTime("now", new \DateTimeZone("UTC"));
    }

    /**
     * Generate a random string, using a cryptographically secure 
     * pseudorandom number generator (random_int)
     * 
     * @param int $length      How many characters do we want?
     * @param string $keyspace A string of all possible characters
     *                         to select from
     * @return string
     */
    public static function generate_random_password(
        $length,
        $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    ) {
        $str = '';
        $max = mb_strlen($keyspace, '8bit') - 1;
        if ($max < 1) {
            throw new Exception('$keyspace must be at least two characters long');
        }
        for ($i = 0; $i < $length; ++$i) {
            $str .= $keyspace[random_int(0, $max)];
        }
        return $str;
    }
}