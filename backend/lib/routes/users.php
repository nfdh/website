<?php

use Lib\Results\JSON;

function register_users_routes(FastRoute\RouteCollector $r, \Lib\Database $db, $user) {
    $r->addRoute('GET', 'api/users', function($_, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        $filter = null;
        
        if(isset($_GET['$filter'])) {
            $filterSql = "
                WHERE `name` LIKE :nameFilter
                OR `email` LIKE :emailFilter
            ";

            $filter = str_replace(['\\', '_', '%'], ['\\\\', '\\_', '\\%'], $_GET['$filter']);
        }
        else {
            $filterSql = "";
        }

        // Count total number of users
        $sqlParameters = [];
        if($filter) {
            $sqlParameters[":nameFilter"] = "%$filter%";
            $sqlParameters[":emailFilter"] = "%$filter%";
        }
        $row = $db->querySingle("
            SELECT COUNT(1) AS `cnt`
            FROM `users`
            $filterSql
        ", $sqlParameters);
        $totalCount = $row['cnt'];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $sqlParameters = [
            ":limit" => $pageSize,
            ":skip" => $page * $pageSize
        ];
        if($filter) {
            $sqlParameters[":nameFilter"] = "%$filter%";
            $sqlParameters[":emailFilter"] = "%$filter%";
        }

        $rows = $db->queryAll("
            SELECT `id`, `name`, `email` 
            FROM `users`
            $filterSql
            LIMIT :limit
            OFFSET :skip
        ", $sqlParameters);

        return new JSON([
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'email' => $row['email']
                ];
            }, $rows)
        ]);
    });

    $r->addRoute('GET', 'api/users/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        $id = $para['id'];

        // Count total number of users
        $user = $db->querySingle("
            SELECT 
                `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                `role_website_contributor`, `role_member_administrator`, `role_studbook_administrator`, `role_studbook_inspector`
            FROM `users`
            WHERE id = :id
        ", [
            ':id' => intval($id)
        ]);

        if(!$user) {
            return new JSON([
                'success' => false,
                'reason' => 'USER_NOT_FOUND'
            ]);
        }

        return new JSON([
            'success' => true,
            'user' => [
                'name' => $user['name'],
                'email' => $user['email'],
                'studbook_heideschaap' => $user['studbook_heideschaap'], 
                'studbook_heideschaap_ko' => $user['studbook_heideschaap_ko'], 
                'studbook_schoonebeeker' => $user['studbook_schoonebeeker'],
                'studbook_schoonebeeker_ko' => $user['studbook_schoonebeeker_ko'], 
                'role_website_contributor' => $user['role_website_contributor'],
                'role_member_administrator' => $user['role_member_administrator'],
                'role_studbook_administrator' => $user['role_studbook_administrator'], 
                'role_studbook_inspector' => $user['role_studbook_inspector']
            ]
        ]);
    });

    $r->addRoute('DELETE', 'api/users', function($_, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }
        
        $sql = "
            DELETE
            FROM `users`
        ";

        $type = $values['type'];
        $items = array_values($values['items']);
        $sqlParameters = [];

        if($type === 'including') {
            $sql .= "WHERE `id` IN (";
            foreach($items as $k => $v) {
                $sql .= ":i$k";
                $sqlParameters[":i$k"] = $v;
            }
            $sql .= ")";
        }
        else if($type === 'excluding') {
            if(count($items) > 0) {
                $sql .= "WHERE `id` NOT IN (";
                foreach($items as $k => $v) {
                    $sql .= ":i$k";
                    $sqlParameters[":i$k"] = $v;
                }
                $sql .= ")";
            }
        }

        $db->execute($sql, $sqlParameters);

        return new JSON([
            'success' => true
        ]);
    });

    $r->addRoute('POST', 'api/users', function($_, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        try {
            $db->execute("
                INSERT INTO `users` (
                    `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                    `role_website_contributor`, `role_member_administrator`, `role_studbook_administrator`, `role_studbook_inspector`
                )
                VALUES (
                    :email, :name, :studbook_heideschaap, :studbook_heideschaap_ko, :studbook_schoonebeeker, :studbook_schoonebeeker_ko,
                    :role_website_contributor, :role_member_administrator, :role_studbook_administrator, :role_studbook_inspector
                )
            ", [
                ':email' => $values['email'],
                ':name' => $values['name'],
                ':studbook_heideschaap' => $values['studbook_heideschaap'],
                ':studbook_heideschaap_ko' => $values['studbook_heideschaap_ko'],
                ':studbook_schoonebeeker' => $values['studbook_schoonebeeker'],
                ':studbook_schoonebeeker_ko' => $values['studbook_schoonebeeker_ko'],
                ':role_website_contributor' => $values['role_website_contributor'],
                ':role_member_administrator' => $values['role_member_administrator'],
                ':role_studbook_administrator' => $values['role_studbook_administrator'],
                ':role_studbook_inspector' => $values['role_studbook_inspector']
            ]);

            return new JSON([
                "success" => true,
                "id" => $db->lastInsertId()
            ]);
        }
        catch (\PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                return new JSON([
                    "success" => false,
                    "reason" => "EMAIL_ALREADY_IN_USE"
                ]);
            }
        }

        return new JSON([
            "success" => false,
            "reason" => "UNKNOWN"
        ]);
    });

    $r->addRoute('PATCH', 'api/users/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return new JSON([
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ]);
        }

        $id = $para['id'];

        try {
            $db->execute("
                UPDATE `users` 
                SET
                    `email` = :email, 
                    `name` = :name,
                    `studbook_heideschaap` = :studbook_heideschaap, 
                    `studbook_heideschaap_ko` = :studbook_heideschaap_ko, 
                    `studbook_schoonebeeker` = :studbook_schoonebeeker, 
                    `studbook_schoonebeeker_ko` = :studbook_schoonebeeker_ko, 
                    `role_website_contributor` = :role_website_contributor, 
                    `role_member_administrator` = :role_member_administrator,
                    `role_studbook_administrator` = :role_studbook_administrator, 
                    `role_studbook_inspector` = :role_studbook_inspector
                WHERE
                    id = :id
            ", [
                ':id' => intval($id),
                ':email' => $values['email'],
                ':name' => $values['name'],
                ':studbook_heideschaap' => $values['studbook_heideschaap'],
                ':studbook_heideschaap_ko' => $values['studbook_heideschaap_ko'],
                ':studbook_schoonebeeker' => $values['studbook_schoonebeeker'],
                ':studbook_schoonebeeker_ko' => $values['studbook_schoonebeeker_ko'],
                ':role_website_contributor' => $values['role_website_contributor'],
                ':role_member_administrator' => $values['role_member_administrator'],
                ':role_studbook_administrator' => $values['role_studbook_administrator'],
                ':role_studbook_inspector' => $values['role_studbook_inspector']
            ]);

            return new JSON([
                "success" => true
            ]);
        }
        catch (\PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                return new JSON([
                    "success" => false,
                    "reason" => "EMAIL_ALREADY_IN_USE"
                ]);
            }
        }

        return new JSON([
            "success" => false,
            "reason" => "UNKNOWN"
        ]);
    });
}