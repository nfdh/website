<?php

namespace Lib;

class DataContext {
    private $conn;

    function __construct($server, $username, $password, $database) {
        $dsn = "mysql:host=$server;dbname=$database;charset=utf8mb4";

        $this->conn = new \PDO($dsn, $username, $password, array(\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION));
    }

    function login($email, $password) {
        $stmt = $this->conn->prepare("
            SELECT `id`, `email`, `password_hash`, `role`
            FROM `users`
            WHERE `email` = :email
        ");
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_NUM);
        if (!$row || !password_verify($password, $row[2])) {
            return false;
        }

        return [
            "id" => $row[0],
            "email" => $row[1],
            "role" => $row[3]
        ];
    }

    function get_users($searchTerm, $count, $after) {
        $sql = "SELECT COUNT(1), MIN(`id`), MAX(`id`) FROM `users` WHERE 1=1";
        
        if ($searchTerm) {
            $sql .= " AND (`name` LIKE :searchTerm OR `email` LIKE :searchTerm)";
        }

        $stmt = $this->conn->prepare($sql);

        if ($searchTerm) {
            $searchTermLike = "%$searchTerm%";
            $stmt->bindParam(':searchTerm', $searchTermLike);
        }

        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_NUM);

        $totalCount = $row[0];
        $firstCursor = $row[1];
        $lastCursor = $row[2];

        $sql = "SELECT `id`, `name`, `email`, `role`
            FROM `users`
            WHERE 1=1";

        if ($searchTerm) {
            $sql .= " AND (`name` LIKE :searchTerm OR `email` LIKE :searchTerm)";
        }

        if ($after) {
            $sql .= " AND `id` > :after";
        }

        $sql .= " ORDER BY `id` LIMIT :count";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':count', $count, \PDO::PARAM_INT);

        if ($searchTerm) {
            $searchTermLike = "%$searchTerm%";
            $stmt->bindParam(':searchTerm', $searchTermLike);
        }

        if ($after) {
            $stmt->bindParam(':after', $after);
        }

        $stmt->execute();

        $result = [];

        while ($row = $stmt->fetch(\PDO::FETCH_NUM)) {
            array_push($result, [
                "id" => $row[0],
                "name" => $row[1],
                "email" => $row[2],
                "role" => $row[3]
            ]);
        }

        return [
            "totalCount" => $totalCount,
            "first" => $firstCursor,
            "last" => $lastCursor,
            "list" => $result
        ];
    }
}