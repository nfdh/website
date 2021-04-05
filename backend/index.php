<?php
require 'lib/vendor/autoload.php';

use Conf\Settings;

session_start();

$user = $_SESSION['user'];

$conf = Settings::get();
$server = $conf['db_server'];
$database = $conf['db_database'];
$dsn = "mysql:host=$server;dbname=$database;charset=utf8mb4";
$conn = new \PDO($dsn, $conf['db_username'], $conf['db_password'], array(
    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_EMULATE_PREPARES => false
));

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) use ($conn, $user) {
    $r->addRoute('POST', 'api/login', function($_, $values) use ($conn, $user) {
        $stmt = $conn->prepare("
            SELECT `id`, `name`, `email`, `password_hash`, `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector` 
            FROM `users`
            WHERE `email` = :email
        ");
        $stmt->bindValue(':email', $values['email']);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        if (!$row || !password_verify($values['password'], $row['password_hash'])) {
            return false;
        }

        $_SESSION['user'] = $user = [
            "id" => $row["id"],
            "name" => $row['name'],
            "email" => $row['email'],
			"role_website_contributor" => boolval($row['role_website_contributor']),
			"role_studbook_administrator" => boolval($row['role_studbook_administrator']),
			"role_studbook_inspector" => boolval($row['role_studbook_inspector'])
        ];

        return [
			"name" => $row['name'],
            "email" => $row['email'],
			"role_website_contributor" => boolval($row['role_website_contributor']),
			"role_studbook_administrator" => boolval($row['role_studbook_administrator']),
			"role_studbook_inspector" => boolval($row['role_studbook_inspector'])
        ];
    });

    $r->addRoute('GET', 'api/users', function($_, $values) use ($conn, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $filter = null;
        
        if(isset($_GET['filter'])) {
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
        $stmt = $conn->prepare("
            SELECT COUNT(1)
            FROM `users`
            $filterSql
        ");

        if($filter) {
            $stmt->bindValue(":nameFilter", "%$filter%");
            $stmt->bindValue(":emailFilter", "%$filter%");
        }

        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_NUM);
        $totalCount = $row[0];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $stmt = $conn->prepare("
            SELECT `id`, `name`, `email` 
            FROM `users`
            $filterSql
            LIMIT :limit
            OFFSET :skip
        ");

        $stmt->bindValue(':limit', $pageSize);
        $stmt->bindValue(':skip', $page * $pageSize);

        if($filter) {
            $stmt->bindValue(":nameFilter", "%$filter%");
            $stmt->bindValue(":emailFilter", "%$filter%");
        }

        $stmt->execute();

        return [
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'email' => $row['email']
                ];
            }, $stmt->fetchAll(\PDO::FETCH_ASSOC))
        ];
    });

    $r->addRoute('GET', 'api/users/{id:\d+}', function($para, $values) use ($conn, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        // Count total number of users
        $stmt = $conn->prepare("
            SELECT 
                `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector`
            FROM `users`
            WHERE id = :id
        ");

        $stmt->bindValue(':id', intval($id));
        $stmt->execute();

        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        if(!$user) {
            return [
                'success' => false,
                'reason' => 'USER_NOT_FOUND'
            ];
        }

        return [
            'success' => true,
            'user' => [
                'name' => $user['name'],
                'email' => $user['email'],
                'studbook_heideschaap' => $user['studbook_heideschaap'], 
                'studbook_heideschaap_ko' => $user['studbook_heideschaap_ko'], 
                'studbook_schoonebeeker' => $user['studbook_schoonebeeker'],
                'studbook_schoonebeeker_ko' => $user['studbook_schoonebeeker_ko'], 
                'role_website_contributor' => $user['role_website_contributor'],
                'role_studbook_administrator' => $user['role_studbook_administrator'], 
                'role_studbook_inspector' => $user['role_studbook_inspector']
            ]
        ];
    });

    $r->addRoute('DELETE', 'api/users', function($_, $values) use ($conn, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }
        
        $sql = "
            DELETE
            FROM `users`
        ";

        $type = $values['type'];
        $items = array_values($values['items']);
        $bindItems = false;

        if($type === 'including') {
            $sql .= "WHERE `id` IN (";
            foreach($items as $k => $v) {
                $sql .= ":i$k";
            }
            $sql .= ")";
            $bindItems = true;
        }
        else if($type === 'excluding') {
            if(count($items) > 0) {
                $sql .= "WHERE `id` NOT IN (";
                foreach($items as $k => $v) {
                    $sql .= ":i$k";
                }
                $sql .= ")";
                $bindItems = true;
            }
        }

        $stmt = $conn->prepare($sql);

        if($bindItems) {
            foreach($items as $k => $v) {
                $stmt->bindValue(":i$k", intval($v));
            }
        }      

        $stmt->execute();

        return [
            'success' => true
        ];
    });

    $r->addRoute('POST', 'api/users', function($_, $values) use ($conn, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $stmt = $conn->prepare("
            INSERT INTO `users` (
                `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector`
            )
            VALUES (
                :email, :name, :studbook_heideschaap, :studbook_heideschaap_ko, :studbook_schoonebeeker, :studbook_schoonebeeker_ko,
                :role_website_contributor, :role_studbook_administrator, :role_studbook_inspector
            )
        ");
        $stmt->bindValue(':email', $values['email']);
        $stmt->bindValue(':name', $values['name']);
        $stmt->bindValue(':studbook_heideschaap', $values['studbook_heideschaap']);
        $stmt->bindValue(':studbook_heideschaap_ko', $values['studbook_heideschaap_ko']);
        $stmt->bindValue(':studbook_schoonebeeker', $values['studbook_schoonebeeker']);
        $stmt->bindValue(':studbook_schoonebeeker_ko', $values['studbook_schoonebeeker_ko']);
        $stmt->bindValue(':role_website_contributor', $values['role_website_contributor']);
        $stmt->bindValue(':role_studbook_administrator', $values['role_studbook_administrator']);
        $stmt->bindValue(':role_studbook_inspector', $values['role_studbook_inspector']);

        try {
            $stmt->execute();

            return [
                "success" => true,
                "id" => $conn->lastInsertId()
            ];
        }
        catch (\PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                return [
                    "success" => false,
                    "reason" => "EMAIL_ALREADY_IN_USE"
                ];
            }
        }

        return [
            "success" => false,
            "reason" => "UNKNOWN"
        ];
    });

    $r->addRoute('PATCH', 'api/users/{id:\d+}', function($para, $values) use ($conn, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        $stmt = $conn->prepare("
            UPDATE `users` 
            SET
                `email` = :email, 
                `name` = :name,
                `studbook_heideschaap` = :studbook_heideschaap, 
                `studbook_heideschaap_ko` = :studbook_heideschaap_ko, 
                `studbook_schoonebeeker` = :studbook_schoonebeeker, 
                `studbook_schoonebeeker_ko` = :studbook_schoonebeeker_ko, 
                `role_website_contributor` = :role_website_contributor, 
                `role_studbook_administrator` = :role_studbook_administrator, 
                `role_studbook_inspector` = :role_studbook_inspector
            WHERE
                id = :id
        ");
        $stmt->bindValue(':id', intval($id));
        $stmt->bindValue(':email', $values['email']);
        $stmt->bindValue(':name', $values['name']);
        $stmt->bindValue(':studbook_heideschaap', $values['studbook_heideschaap']);
        $stmt->bindValue(':studbook_heideschaap_ko', $values['studbook_heideschaap_ko']);
        $stmt->bindValue(':studbook_schoonebeeker', $values['studbook_schoonebeeker']);
        $stmt->bindValue(':studbook_schoonebeeker_ko', $values['studbook_schoonebeeker_ko']);
        $stmt->bindValue(':role_website_contributor', $values['role_website_contributor']);
        $stmt->bindValue(':role_studbook_administrator', $values['role_studbook_administrator']);
        $stmt->bindValue(':role_studbook_inspector', $values['role_studbook_inspector']);

        try {
            $stmt->execute();

            return [
                "success" => true
            ];
        }
        catch (\PDOException $e) {
            if ($e->errorInfo[1] == 1062) {
                return [
                    "success" => false,
                    "reason" => "EMAIL_ALREADY_IN_USE"
                ];
            }
        }

        return [
            "success" => false,
            "reason" => "UNKNOWN"
        ];
    });

    $r->addRoute('GET', 'api/dekverklaringen', function($para, $values) use ($conn, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        // Count total number of users
        $stmt = $conn->prepare("
            SELECT COUNT(1)
            FROM `dekverklaringen`
            WHERE
                `user_id` = :user_id
        ");

        $stmt->bindValue(":user_id", $user['id']);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_NUM);
        $totalCount = $row[0];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $stmt = $conn->prepare("
            SELECT `id`, `season`, `studbook`, `date_sent`
            FROM `dekverklaringen`
            WHERE
                `user_id` = :user_id
            LIMIT :limit
            OFFSET :skip
        ");

        $stmt->bindValue(':limit', $pageSize);
        $stmt->bindValue(':skip', $page * $pageSize);
        $stmt->bindValue(":user_id", $user['id']);
        $stmt->execute();

        return [
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    "id" => $row['id'],
                    "season" => $row['season'],
                    "studbook" => $row['studbook'],
                    "date_sent" => \DateTime::createFromFormat('Y-m-d H:i:s', $row['date_sent'])->format(\DateTime::ISO8601)
                ];
            }, $stmt->fetchAll(\PDO::FETCH_ASSOC))
        ];
    });

    $r->addRoute('POST', 'api/dekverklaringen', function($_, $values) use ($conn, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $conn->beginTransaction();

		try {
			$sql = '
				INSERT INTO `dekverklaringen` (`user_id`, `season`, `studbook`, `date_sent`, `name`, `kovo`, `koe`, `kool`, `korl`, `remarks`) 
				VALUES (:user_id, :season, :studbook, :date_sent, :name, :kovo, :koe, :kool, :korl, :remarks)
			';

        	$stmt = $conn->prepare($sql);
			$stmt->bindValue(':user_id', $user['id']);
			$stmt->bindValue(':season', $values['season']);
			$stmt->bindValue(':studbook', $values['studbook']);

			$date_sent = new \DateTime("now", new \DateTimeZone("UTC"));
			$stmt->bindValue(':date_sent', $date_sent->format('Y-m-d H:i:s'));
			$stmt->bindValue(':name', $values['name']);
			$stmt->bindValue(':kovo', $values['kovo']);
			$stmt->bindValue(':koe', $values['koe']);
			$stmt->bindValue(':kool', $values['kool']);
			$stmt->bindValue(':korl', $values['korl']);
			$stmt->bindValue(':remarks', $values['remarks']);
			$stmt->execute();

			$dekverklaring_id = $conn->lastInsertId();

			$sql = '
				INSERT INTO `dekverklaring_dekgroepen` (`dekverklaring_id`, `ewe_count`)
				VALUES (:dekverklaring_id, :ewe_count)
			';
			$stmt = $conn->prepare($sql);

			$sql = '
				INSERT INTO `dekverklaring_dekgroep_rammen` (`dekgroep_id`, `code`)
				VALUES (:dekgroep_id, :code)
			';
			$stmt2 = $conn->prepare($sql);

			foreach($values['dekgroepen'] as $dekgroep) {
				$stmt->bindValue(':dekverklaring_id', $dekverklaring_id);
				$stmt->bindValue(':ewe_count', $dekgroep['ewe_count']);
				$stmt->execute();

				$dekgroep_id = $conn->lastInsertId();
				foreach($dekgroep['rammen'] as $ram) {
					$stmt2->bindValue(':dekgroep_id', $dekgroep_id);
					$stmt2->bindValue(':code', $ram);
					$stmt2->execute();
				}
			}

			$conn->commit();

			// We return the created dekverklaring
			return [
				'success' => true,
                'id' => $dekverklaring_id
			];
		}
		catch(Exception $ex) {
			$conn->rollBack();
			throw $ex;
		}
    });

    $r->addRoute('GET', 'api/dekverklaringen/{id:\d+}', function($para, $values) use ($conn, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        // Get the dekverklaring
        $stmt = $conn->prepare("
            SELECT `season`, `studbook`, `name`, `kovo`, `koe`, `kool`, `korl`, `remarks`
            FROM `dekverklaringen`
            WHERE id = :id
              AND user_id = :user_id
        ");

        $stmt->bindValue(':id', intval($id));
        $stmt->bindValue(':user_id', $user['id']);
        $stmt->execute();

        $dekverklaring = $stmt->fetch(\PDO::FETCH_ASSOC);
        if(!$dekverklaring) {
            return [
                'success' => false,
                'reason' => 'DEKVERKLARING_NOT_FOUND'
            ];
        }
        
        // Get dekgroepen
        $stmt = $conn->prepare("
            SELECT `id`, `ewe_count`
            FROM `dekverklaring_dekgroepen`
            WHERE `dekverklaring_id` = :id
        ");
        $stmt->bindValue(':id', intval($id));
        $stmt->execute();
        $dekgroepen = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // Get rammen
        $stmt = $conn->prepare("
            SELECT `r`.`dekgroep_id`, `r`.`code`
            FROM `dekverklaring_dekgroep_rammen` AS `r`
            INNER JOIN `dekverklaring_dekgroepen` AS `dg`
              ON `dg`.`id` = `r`.`dekgroep_id`
            WHERE `dg`.`dekverklaring_id` = :id
        ");
        $stmt->bindValue(':id', intval($id));
        $stmt->execute();

        while(($row = $stmt->fetch(\PDO::FETCH_ASSOC))) {
            $dekgroep_id = $row['dekgroep_id'];
            $any = false;

            foreach ($dekgroepen as &$dekgroep) {
                if($dekgroep['id'] == $dekgroep_id) {
                    if(!isset($dekgroep['rammen'])) {
                        $dekgroep['rammen'] = [];
                    }
                    array_push($dekgroep['rammen'], $row['code']);
                    $any = true;
                    break;
                }
            }
        }

        return [
            'success' => true,
            'dekverklaring' => [
                'season' => $dekverklaring['season'], 
                'studbook' => $dekverklaring['studbook'],
                'name' => $dekverklaring['name'], 
                'kovo' => $dekverklaring['kovo'],
                'koe' => $dekverklaring['koe'], 
                'kool' => $dekverklaring['kool'], 
                'korl' => $dekverklaring['korl'], 
                'dekgroepen' => array_map(function($dekgroep) {
                    return [
                        'ewe_count' => $dekgroep['ewe_count'],
                        'rammen' => $dekgroep['rammen']
                    ];
                }, $dekgroepen),
                'remarks' => $dekverklaring['remarks']
            ]
        ];
    });

    $r->addRoute('GET', 'api/huiskeuringen', function($_, $values) use ($conn, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        // Count total number of users
        $stmt = $conn->prepare("
            SELECT COUNT(1)
            FROM `huiskeuringen`
            WHERE user_id = :user_id
        ");

        $stmt->bindValue(":user_id", $user['id']);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_NUM);
        $totalCount = $row[0];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $stmt = $conn->prepare("
            SELECT `id`, `year`, `region`, `preferred_date`, `date_sent`
            FROM `huiskeuringen`
            WHERE `user_id` = :user_id
            LIMIT :limit
            OFFSET :skip
        ");

        $stmt->bindValue(':limit', $pageSize);
        $stmt->bindValue(':skip', $page * $pageSize);
        $stmt->bindValue(":user_id", $user['id']);
        $stmt->execute();

        return [
            'success' => true,
            'totalCount' => $totalCount,
            'pageIndex' => $page,
            'rows' => array_map(function($row) {
                return [
                    'id' => $row['id'],
                    'year' => $row['year'],
                    'region' => $row['region'],
                    'preferred_date' => $row['preferred_date'], 
                    "date_sent" => \DateTime::createFromFormat('Y-m-d H:i:s', $row['date_sent'])->format(\DateTime::ISO8601)
                ];
            }, $stmt->fetchAll(\PDO::FETCH_ASSOC))
        ];
    });

    $r->addRoute('GET', 'api/huiskeuringen/{id:\d+}', function($para, $values) use ($conn, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        // Count total number of users
        $stmt = $conn->prepare("
            SELECT `name`, `region`, `preferred_date`, `rams_first`, `rams_second`, `ewes`, `locations`, `on_paper`, `remarks`
            FROM `huiskeuringen`
            WHERE id = :id
              AND user_id = :user_id
        ");

        $stmt->bindValue(':id', intval($id));
        $stmt->bindValue(':user_id', $user['id']);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        if(!$row) {
            return [
                'success' => false,
                'reason' => 'HUISKEURING_NOT_FOUND'
            ];
        }

        return [
            'success' => true,
            'huiskeuring' => [
                'name' => $row['name'],
                'region' => $row['region'],
                'preferred_date' => $row['preferred_date'], 
                'rams_first' => $row['rams_first'], 
                'rams_second' => $row['rams_second'],
                'ewes' => $row['ewes'], 
                'locations' => $row['locations'], 
                'on_paper' => $row['on_paper'], 
                'remarks' => $row['remarks']
            ]
        ];
    });

    $r->addRoute('POST', 'api/huiskeuringen', function($_, $values) use ($conn, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $stmt = $conn->prepare("
            INSERT INTO `huiskeuringen` (
                `user_id`, `year`, `name`, `region`, `preferred_date`, `rams_first`, `rams_second`, `ewes`, `locations`, `on_paper`, `remarks`, `date_sent`
            )
            VALUES (
                :user_id, :year, :name, :region, :preferred_date, :rams_first, :rams_second, :ewes, :locations, :on_paper, :remarks, :date_sent
            )
        ");

        $date_sent = new \DateTime("now", new \DateTimeZone("UTC"));
        $year = intval($date_sent->format('Y'));

        $stmt->bindValue(':user_id', $user['id']);
        $stmt->bindValue(':year', $year);
        $stmt->bindValue(':name', $values['name']);
        $stmt->bindValue(':region', $values['region']);
        $stmt->bindValue(':preferred_date', $values['preferred_date']);
        $stmt->bindValue(':rams_first', $values['rams_first']);
        $stmt->bindValue(':rams_second', $values['rams_second']);
        $stmt->bindValue(':ewes', $values['ewes']);
        $stmt->bindValue(':locations', $values['locations']);
        $stmt->bindValue(':on_paper', $values['on_paper']);
        $stmt->bindValue(':remarks', $values['remarks']);
        $date_sent = new \DateTime("now", new \DateTimeZone("UTC"));
        $stmt->bindValue(':date_sent', $date_sent->format('Y-m-d H:i:s'));
        $stmt->execute();

        return [
            "success" => true,
            "id" => $conn->lastInsertId()
        ];
    });
});

// Fetch method and URI from somewhere
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Strip query string (?foo=bar) and decode URI
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

// Remove leading slash
if($uri[0] === '/') {
    $uri = substr($uri, 1);
}

// Parse input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        $allowedMethods = $routeInfo[1];
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        
        header('Content-type: application/json');
        echo json_encode($handler($vars, $input));
        break;
}