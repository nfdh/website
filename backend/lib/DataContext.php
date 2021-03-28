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
            SELECT `id`, `name`, `email`, `password_hash`, `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector` 
            FROM `users`
            WHERE `email` = :email
        ");
        $stmt->bindValue(':email', $email);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_NUM);
        if (!$row || !password_verify($password, $row[3])) {
            return false;
        }

        return [
			"id" => $row[0],
			"name" => $row[1],
            "email" => $row[2],
			"role_website_contributor" => $row[6] != 0,
			"role_studbook_administrator" => $row[7] != 0,
			"role_studbook_inspector" => $row[8] != 0
        ];
    }

    function get_user($id) {
        $sql = "
            SELECT `email`, `name`, 
                `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`,
                `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector`
            FROM `users`
            WHERE `id` = :user_id
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':user_id', $id);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_NUM);

        if(!$row) {
            return false;
        }

        return [
            "email" => $row[0],
            "name" => $row[1],
            "studbook_heideschaap" => $row[2],
            "studbook_heideschaap_ko" => $row[3],
            "studbook_schoonebeeker" => $row[4],
            "studbook_schoonebeeker_ko" => $row[5],

			"role_website_contributor" => $row[6],
			"role_studbook_administrator" => $row[7],
			"role_studbook_inspector" => $row[8]
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
            $stmt->bindValue(':searchTerm', $searchTermLike);
        }

        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_NUM);

        $totalCount = $row[0];
        $firstCursor = $row[1];
        $lastCursor = $row[2];

        $sql = "SELECT `id`, `name`, `email`
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

        $stmt->bindValue(':count', $count, \PDO::PARAM_INT);

        if ($searchTerm) {
            $searchTermLike = "%$searchTerm%";
            $stmt->bindValue(':searchTerm', $searchTermLike);
        }

        if ($after) {
            $stmt->bindValue(':after', $after);
        }

        $stmt->execute();

        $result = [];

        while ($row = $stmt->fetch(\PDO::FETCH_NUM)) {
            array_push($result, [
                "id" => $row[0],
                "name" => $row[1],
                "email" => $row[2]
            ]);
        }

        return [
            "totalCount" => $totalCount,
            "first" => $firstCursor,
            "last" => $lastCursor,
            "list" => $result
        ];
	}

    function add_user($user) {
        $sql = '
            INSERT INTO `users` (`name`, `email`, `password_hash`, 
                `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector` ) 
            VALUES (:name, :email, :password_hash, 
                :studbook_heideschaap, :studbook_heideschaap_ko, :studbook_schoonebeeker, :studbook_schoonebeeker_ko,
                :role_website_contributor, :role_studbook_administrator, :role_studbook_inspector)
        ';

        $password_hash = password_hash($user["password"], PASSWORD_DEFAULT);

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':name', $user['name']);
        $stmt->bindValue(':email', $user['email']);
        $stmt->bindValue(':password_hash', $password_hash);
        $stmt->bindValue(':studbook_heideschaap', $user['studbook_heideschaap']);
        $stmt->bindValue(':studbook_heideschaap_ko', $user['studbook_heideschaap_ko']);
        $stmt->bindValue(':studbook_schoonebeeker', $user['studbook_schoonebeeker']);
        $stmt->bindValue(':studbook_schoonebeeker_ko', $user['studbook_schoonebeeker_ko']);
        $stmt->bindValue(':role_website_contributor', $user['role_website_contributor']);
        $stmt->bindValue(':role_studbook_administrator', $user['role_studbook_administrator']);
        $stmt->bindValue(':role_studbook_inspector', $user['role_studbook_inspector']);
        $stmt->execute();

        $user_id = $this->conn->lastInsertId();

        // We return the created user
        return [
            'id' => $user_id,	
        ];
    }

    function update_user($id, $user) {
        $sql = '
            UPDATE `users`
            SET
                `name` = :name, 
                `email` = :email, 
                `studbook_heideschaap` = :studbook_heideschaap,
                `studbook_heideschaap_ko` = :studbook_heideschaap_ko,
                `studbook_schoonebeeker` = :studbook_schoonebeeker, 
                `studbook_schoonebeeker_ko` = :studbook_schoonebeeker_ko, 
                `role_website_contributor` = :role_website_contributor, 
                `role_studbook_administrator` = :role_studbook_administrator, 
                `role_studbook_inspector` = :role_studbook_inspector 
            WHERE
                id = :user_id
        ';

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':user_id', $id);
        $stmt->bindValue(':name', $user['name']);
        $stmt->bindValue(':email', $user['email']);
        $stmt->bindValue(':studbook_heideschaap', $user['studbook_heideschaap']);
        $stmt->bindValue(':studbook_heideschaap_ko', $user['studbook_heideschaap_ko']);
        $stmt->bindValue(':studbook_schoonebeeker', $user['studbook_schoonebeeker']);
        $stmt->bindValue(':studbook_schoonebeeker_ko', $user['studbook_schoonebeeker_ko']);
        $stmt->bindValue(':role_website_contributor', $user['role_website_contributor']);
        $stmt->bindValue(':role_studbook_administrator', $user['role_studbook_administrator']);
        $stmt->bindValue(':role_studbook_inspector', $user['role_studbook_inspector']);
        $stmt->execute();
        
        // We return the created user
        return true;
    }

	function get_dekverklaringen_of_user($user_id, $count, $after) {
        $sql = "SELECT COUNT(1), MIN(`id`), MAX(`id`) FROM `dekverklaringen` WHERE user_id=:user_id"; 

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':user_id', $user_id);

        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_NUM);

        $totalCount = $row[0];
        $firstCursor = $row[1];
        $lastCursor = $row[2];

        $sql = "SELECT `id`, `season`, `studbook`, `date_sent`, `date_corrected`
            FROM `dekverklaringen`
            WHERE user_id=:user_id";

        if ($after) {
            $sql .= " AND `id` > :after";
        }

        $sql .= " ORDER BY `id` LIMIT :count";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(':count', $count, \PDO::PARAM_INT);

		$stmt->bindValue(':user_id', $user_id);

        if ($after) {
            $stmt->bindValue(':after', $after);
        }

        $stmt->execute();

        $result = [];

        while ($row = $stmt->fetch(\PDO::FETCH_NUM)) {
            array_push($result, [
                "id" => $row[0],
                "season" => $row[1],
                "studbook" => $row[2],
				"date_sent" => \DateTime::createFromFormat('Y-m-d H:i:s', $row[3]),
				"date_corrected" => $row[4]
            ]);
        }

        return [
            "totalCount" => $totalCount,
            "first" => $firstCursor,
            "last" => $lastCursor,
            "list" => $result
        ];
	}

	function add_dekverklaring($user_id, $dekverklaring) {
		$this->conn->beginTransaction();

		try {
			$sql = '
				INSERT INTO `dekverklaringen` (`user_id`, `season`, `studbook`, `date_sent`, `name`, `kovo`, `koe`, `kool`, `korl`, `remarks`) 
				VALUES (:user_id, :season, :studbook, :date_sent, :name, :kovo, :koe, :kool, :korl, :remarks)
			';

        	$stmt = $this->conn->prepare($sql);
			$stmt->bindValue(':user_id', $user_id);
			$stmt->bindValue(':season', $dekverklaring['season']);
			$stmt->bindValue(':studbook', $dekverklaring['studbook']);

			$date_sent = new \DateTime("now", new \DateTimeZone("UTC"));
			$stmt->bindValue(':date_sent', $date_sent->format('Y-m-d H:i:s'));
			$stmt->bindValue(':name', $dekverklaring['name']);
			$stmt->bindValue(':kovo', $dekverklaring['kovo']);
			$stmt->bindValue(':koe', $dekverklaring['koe']);
			$stmt->bindValue(':kool', $dekverklaring['kool']);
			$stmt->bindValue(':korl', $dekverklaring['korl']);
			$stmt->bindValue(':remarks', $dekverklaring['remarks']);
			$stmt->execute();

			$dekverklaring_id = $this->conn->lastInsertId();

			$sql = '
				INSERT INTO `dekverklaring_dekgroepen` (`dekverklaring_id`, `ewe_count`)
				VALUES (:dekverklaring_id, :ewe_count)
			';
			$stmt = $this->conn->prepare($sql);

			$sql = '
				INSERT INTO `dekverklaring_dekgroep_rammen` (`dekgroep_id`, `code`)
				VALUES (:dekgroep_id, :code)
			';
			$stmt2 = $this->conn->prepare($sql);

			foreach($dekverklaring['dekgroepen'] as $dekgroep) {
				$stmt->bindValue(':dekverklaring_id', $dekverklaring_id);
				$stmt->bindValue(':ewe_count', $dekgroep['ewe_count']);
				$stmt->execute();

				$dekgroep_id = $this->conn->lastInsertId();
				foreach($dekgroep['rammen'] as $ram) {
					$stmt2->bindValue(':dekgroep_id', $dekgroep_id);
					$stmt2->bindValue(':code', $ram);
					$stmt2->execute();
				}
			}

			$this->conn->commit();

			// We return the created dekverklaring
			return [
				'user_id' => $user_id,
				'season' => $dekverklaring['season'],
				'studbook' => $dekverklaring['studbook'],
				'date_sent' => $date_sent,
				'name' => $dekverklaring['name'],
				'kovo' => $dekverklaring['kovo'],
				'koe' => $dekverklaring['koe'],
				'kool' => $dekverklaring['kool'],
				'korl' => $dekverklaring['korl'],
				'remarks' => $dekverklaring['remarks']	
			];
		}
		catch(Exception $ex) {
			$this->conn->rollBack();
			throw $ex;
		}
	}
}
