<?php
namespace Lib;

class Auth {

    public static function login($db, $email, $password) {
        $select_list = Auth::get_select_list();

        $row = $db->querySingle("
            SELECT `password_hash`, $select_list 
            FROM `users`
            WHERE `email` = :email
        ", [
            ":email" => $email
        ]);

        if (!$row || !password_verify($password, $row['password_hash'])) {
            return false;
        }

        $user_obj = Auth::create_user_obj($row);
        $_SESSION['user'] = $user_obj;
        return $user_obj;
    }

    public static function login_direct($db, $user_id) {
        $select_list = Auth::get_select_list();

        $row = $db->querySingle("
            SELECT $select_list
            FROM `users`
            WHERE `id` = :user_id
        ", [
            ":user_id" => $user_id
        ]);

        if (!$row) {
            return false;
        }

        $user_obj = Auth::create_user_obj($row);
        $_SESSION['user'] = $user_obj;
        return $user_obj;
    }

    public static function logout() {
        unset($_SESSION['user']);
    }

    static function get_select_list() {
        return "`id`, `name`, `email`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, `role_website_contributor`, `role_member_administrator`, `role_studbook_administrator`, `role_studbook_inspector`";
    }

    static function create_user_obj($row) {
        return [
            "id" => $row["id"],
            "name" => $row['name'],
            "email" => $row['email'],
            "studbook_heideschaap" => boolval($row['studbook_heideschaap']),
            "studbook_heideschaap_ko" => boolval($row['studbook_heideschaap_ko']),
            "studbook_schoonebeeker" => boolval($row['studbook_schoonebeeker']),
            "studbook_schoonebeeker_ko" => boolval($row['studbook_schoonebeeker_ko']),
			"role_website_contributor" => boolval($row['role_website_contributor']),
            "role_member_administrator" => boolval($row['role_member_administrator']),
			"role_studbook_administrator" => boolval($row['role_studbook_administrator']),
			"role_studbook_inspector" => boolval($row['role_studbook_inspector'])
        ];
    }
}