<?php
require 'lib/vendor/autoload.php';

use Conf\Settings;
use Lib\Telemetry;
use Lib\Database;

session_start();

$user = null;
if(isset($_SESSION['user'])) {
    $user = $_SESSION['user'];
}

$conf = Settings::get();
$telemetry = new Lib\Telemetry($conf['appInsights'], $user != null ? $user['id'] : null);
$db = new Lib\Database($conf['db'], $telemetry);

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) use ($db, $user) {
    $r->addRoute('POST', 'api/login', function($_, $values) use ($db, $user) {
        $row = $db->querySingle("
            SELECT `id`, `name`, `email`, `password_hash`, `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector` 
            FROM `users`
            WHERE `email` = :email
        ", [
            ":email" => $values['email']
        ]);

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

    $r->addRoute('GET', 'api/users', function($_, $values) use ($db, $user) {
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
            }, $rows)
        ];
    });

    $r->addRoute('GET', 'api/users/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        // Count total number of users
        $user = $db->querySingle("
            SELECT 
                `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector`
            FROM `users`
            WHERE id = :id
        ", [
            ':id' => intval($id)
        ]);

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

    $r->addRoute('DELETE', 'api/users', function($_, $values) use ($db, $user) {
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

        return [
            'success' => true
        ];
    });

    $r->addRoute('POST', 'api/users', function($_, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        try {
            $db->execute("
                INSERT INTO `users` (
                    `email`, `name`, `studbook_heideschaap`, `studbook_heideschaap_ko`, `studbook_schoonebeeker`, `studbook_schoonebeeker_ko`, 
                    `role_website_contributor`, `role_studbook_administrator`, `role_studbook_inspector`
                )
                VALUES (
                    :email, :name, :studbook_heideschaap, :studbook_heideschaap_ko, :studbook_schoonebeeker, :studbook_schoonebeeker_ko,
                    :role_website_contributor, :role_studbook_administrator, :role_studbook_inspector
                )
            ", [
                ':email' => $values['email'],
                ':name' => $values['name'],
                ':studbook_heideschaap' => $values['studbook_heideschaap'],
                ':studbook_heideschaap_ko' => $values['studbook_heideschaap_ko'],
                ':studbook_schoonebeeker' => $values['studbook_schoonebeeker'],
                ':studbook_schoonebeeker_ko' => $values['studbook_schoonebeeker_ko'],
                ':role_website_contributor' => $values['role_website_contributor'],
                ':role_studbook_administrator' => $values['role_studbook_administrator'],
                ':role_studbook_inspector' => $values['role_studbook_inspector']
            ]);

            return [
                "success" => true,
                "id" => $db->lastInsertId()
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

    $r->addRoute('PATCH', 'api/users/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user || !$user['role_website_contributor']) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
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
                ':role_studbook_administrator' => $values['role_studbook_administrator'],
                ':role_studbook_inspector' => $values['role_studbook_inspector']
            ]);

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

    $r->addRoute('GET', 'api/dekverklaringen', function($para, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        // Count total number of users
        $row = $db->querySingle("
            SELECT COUNT(1) AS `cnt`
            FROM `dekverklaringen`
            WHERE
                `user_id` = :user_id
        ", [
            ':user_id' => $user['id']
        ]);
        $totalCount = $row['cnt'];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $rows = $db->queryAll("
            SELECT `id`, `season`, `studbook`, `date_sent`
            FROM `dekverklaringen`
            WHERE
                `user_id` = :user_id
            LIMIT :limit
            OFFSET :skip
        ", [
            ':limit' => $pageSize,
            ':skip' => $page * $pageSize,
            ':user_id' => $user['id']
        ]);

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
            }, $rows)
        ];
    });

    $r->addRoute('POST', 'api/dekverklaringen', function($_, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $trans = $db->beginTransaction();

		try {
            $date_sent = new \DateTime("now", new \DateTimeZone("UTC"));

            $db->execute('
                INSERT INTO `dekverklaringen` (`user_id`, `season`, `studbook`, `date_sent`, `name`, `kovo`, `koe`, `kool`, `korl`, `remarks`) 
                VALUES (:user_id, :season, :studbook, :date_sent, :name, :kovo, :koe, :kool, :korl, :remarks)
            ', [
                ':user_id' => $user['id'],
                ':season' => $values['season'],
                ':studbook' => $values['studbook'],
                ':date_sent' => $date_sent->format('Y-m-d H:i:s'),
                ':name' => $values['name'],
                ':kovo' => $values['kovo'],
                ':koe' => $values['koe'],
                ':kool' => $values['kool'],
                ':korl' => $values['korl'],
                ':remarks' => $values['remarks']
            ]);
			$dekverklaring_id = $db->lastInsertId();

            $dg_stmt = $db->prepare('
				INSERT INTO `dekverklaring_dekgroepen` (`dekverklaring_id`, `ewe_count`)
				VALUES (:dekverklaring_id, :ewe_count)
			');
            $ram_stmt = $db->prepare('
				INSERT INTO `dekverklaring_dekgroep_rammen` (`dekgroep_id`, `code`)
				VALUES (:dekgroep_id, :code)
			');

			foreach($values['dekgroepen'] as $dekgroep) {
                $dg_stmt->execute([
                    ':dekverklaring_id' => $dekverklaring_id,
                    ':ewe_count' => $dekgroep['ewe_count']
                ]);
				$dekgroep_id = $db->lastInsertId();

				foreach($dekgroep['rammen'] as $ram) {
                    $ram_stmt->execute([
                        ':dekgroep_id' => $dekgroep_id,
                        ':code' => $ram
                    ]);
				}
			}

			$trans->commit();

			// We return the created dekverklaring
			return [
				'success' => true,
                'id' => $dekverklaring_id
			];
		}
		catch(Exception $ex) {
			$trans->rollBack();
			throw $ex;
		}
    });

    $r->addRoute('GET', 'api/dekverklaringen/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        // Get the dekverklaring
        $dekverklaring = $db->querySingle("
            SELECT `season`, `studbook`, `name`, `kovo`, `koe`, `kool`, `korl`, `remarks`
            FROM `dekverklaringen`
            WHERE id = :id
            AND user_id = :user_id
        ", [
            ':id' => intval($id),
            ':user_id' => $user['id']
        ]);
        if(!$dekverklaring) {
            return [
                'success' => false,
                'reason' => 'DEKVERKLARING_NOT_FOUND'
            ];
        }
        
        // Get dekgroepen
        $dekgroepen = $db->queryAll("
            SELECT `id`, `ewe_count`
            FROM `dekverklaring_dekgroepen`
            WHERE `dekverklaring_id` = :id
        ", [
            ':id' => intval($id)
        ]);

        // Get rammen
        $rammen = $db->queryAll("
            SELECT `r`.`dekgroep_id`, `r`.`code`
            FROM `dekverklaring_dekgroep_rammen` AS `r`
            INNER JOIN `dekverklaring_dekgroepen` AS `dg`
              ON `dg`.`id` = `r`.`dekgroep_id`
            WHERE `dg`.`dekverklaring_id` = :id
        ", [
            ':id' => intval($id)
        ]);

        foreach($rammen as $row) {
            $dekgroep_id = $row['dekgroep_id'];

            foreach ($dekgroepen as &$dekgroep) {
                if($dekgroep['id'] == $dekgroep_id) {
                    if(!isset($dekgroep['rammen'])) {
                        $dekgroep['rammen'] = [];
                    }
                    array_push($dekgroep['rammen'], $row['code']);
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

    $r->addRoute('GET', 'api/huiskeuringen', function($_, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        // Count total number of users
        $row = $db->querySingle("
            SELECT COUNT(1) AS `cnt`
            FROM `huiskeuringen`
            WHERE user_id = :user_id
        ", [
            ':user_id' => $user['id']
        ]);
        $totalCount = $row['cnt'];

        // Fetch the users
        $page = intval($_GET['$page']);
        $pageSize = intval($_GET['$pageSize']);

        // Fix-up the page if it goes beyond the count
        if($page * $pageSize > $totalCount) {
            $page = floor($totalCount / $pageSize);
        }

        $rows = $db->queryAll("
            SELECT `id`, `year`, `region`, `preferred_date`, `date_sent`
            FROM `huiskeuringen`
            WHERE `user_id` = :user_id
            LIMIT :limit
            OFFSET :skip
        ", [
            ':limit' => $pageSize,
            ':skip' => $page * $pageSize,
            ":user_id" => $user['id']
        ]);

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
            }, $rows)
        ];
    });

    $r->addRoute('GET', 'api/huiskeuringen/{id:\d+}', function($para, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $id = $para['id'];

        $row = $db->querySingle("
            SELECT `name`, `region`, `preferred_date`, `rams_first`, `rams_second`, `ewes`, `locations`, `on_paper`, `remarks`
            FROM `huiskeuringen`
            WHERE id = :id
              AND user_id = :user_id
        ", [
            ':id' => intval($id),
            ':user_id' => $user['id']
        ]);

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

    $r->addRoute('POST', 'api/huiskeuringen', function($_, $values) use ($db, $user) {
        if(!$user) {
            http_response_code(401);
            return [
                "success" => false,
                "reason" => "UNAUTHORIZED"
            ];
        }

        $date_sent = new \DateTime("now", new \DateTimeZone("UTC"));       
        
        $db->execute("
            INSERT INTO `huiskeuringen` (
                `user_id`, `year`, `name`, `region`, `preferred_date`, `rams_first`, `rams_second`, `ewes`, `locations`, `on_paper`, `remarks`, `date_sent`
            )
            VALUES (
                :user_id, :year, :name, :region, :preferred_date, :rams_first, :rams_second, :ewes, :locations, :on_paper, :remarks, :date_sent
            )
        ", [
            ':user_id' => $user['id'],
            ':year' => intval($date_sent->format('Y')),
            ':name' => $values['name'],
            ':region' => $values['region'],
            ':preferred_date' => $values['preferred_date'],
            ':rams_first' => $values['rams_first'],
            ':rams_second' => $values['rams_second'],
            ':ewes' => $values['ewes'],
            ':locations' => $values['locations'],
            ':on_paper' => $values['on_paper'],
            ':remarks' => $values['remarks'],
            ':date_sent' => $date_sent->format('Y-m-d H:i:s')
        ]);

        return [
            "success" => true,
            "id" => $db->lastInsertId()
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