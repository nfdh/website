<?php

namespace Lib;

class DataContext {
    private $conn;

    function __construct($server, $username, $password, $database) {
        $dsn = "mysql:host=$server;dbname=$database;charset=utf8mb4";

        $this->conn = new \PDO($dsn, $username, $password, array(\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION));
    }

    function login($username, $password) {
        $stmt = $this->conn->prepare("
            SELECT `id`, `name`, `password_hash`, `role`
            FROM `users`
            WHERE `username` = :username
        ");
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_NUM);
        if (!$row || !password_verify($password, $row[2])) {
            return false;
        }

        return [
            "id" => $row[0],
            "name" => $row[1],
            "role" => $row[3]
        ];
    }
}