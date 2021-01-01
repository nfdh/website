<?php

namespace Lib;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\UnionType;
use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

class SchemaTypes {
    public static $userRoleType;
    public static $userType;
    public static $pageInfoType;
    public static $usersConnectionType;
    public static $usersEdgeType;
    public static $viewerType;
    public static $queryType;
    public static $successLoginResult;
    public static $failedLoginReason;
    public static $failedLoginResult;
    public static $mutationType;
    public static $schema;

    static function init() {
        SchemaTypes::$userRoleType = new EnumType([
            'name' => 'UserRole',
            'values' => [
                'MEMBER' => [
                    'value' => 0
                ]
            ]
        ]);

        SchemaTypes::$userType = new ObjectType([
            'name' => 'User',
            'fields' => [
                'id' => Type::string(),
                'name' => Type::string(),
                'email' => Type::string(),
                'role' => [
                    "type" => SchemaTypes::$userRoleType
                ]
            ],
        ]);

        SchemaTypes::$viewerType = new ObjectType([
            'name' => 'Viewer',
            'fields' => [
                'user' => [
                    'type' => SchemaTypes::$userType,
                    'resolve' => function ($root, $args) {
                        return isset($_SESSION['user']) ? $_SESSION['user'] : null;
                    }
                ],
            ],
        ]);

        SchemaTypes::$pageInfoType = new ObjectType([
            'name' => 'PageInfo',
            'fields' => [
                'hasPreviousPage' => Type::nonNull(Type::boolean()),
                'hasNextPage' => Type::nonNull(Type::boolean()),
                'startCursor' => Type::string(),
                'endCursor' => Type::string()
            ]
        ]);

        SchemaTypes::$usersEdgeType = new ObjectType([
            'name' => 'UsersEdge',
            'fields' => [
                'node' => SchemaTypes::$userType,
                'cursor' => Type::nonNull(Type::string())
            ]
        ]);

        SchemaTypes::$usersConnectionType = new ObjectType([
            'name' => 'UsersConnection',
            'fields' => [
                'pageInfo' => SchemaTypes::$pageInfoType,
                'edges' => Type::listOf(SchemaTypes::$usersEdgeType)
            ]
        ]);

        SchemaTypes::$queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'viewer' => [
                    'type' => SchemaTypes::$viewerType,
                    'resolve' => function ($root, $args) {
                        return [];
                    }
                ],
                'users' => [
                    'type' => SchemaTypes::$usersConnectionType,
                    'args' => [
                        'searchTerm' => Type::string(),
                        'first' => Type::nonNull(Type::int()),
                        'after' => Type::string()
                    ],
                    'resolve' => function ($root, $args) {
                        $dbUsers = $root['dataContext']->get_users($args['searchTerm'], $args['first'], $args['after'] ?? null);

                        $numTotal = $dbUsers['totalCount'];
                        $numResults = sizeof($dbUsers['list']);

                        return [
                            "totalCount" => $numTotal,
                            "pageInfo" => [
                                'startCursor' => $dbUsers['first'],
                                'endCursor' => $dbUsers['last'],
                                'hasNextPage' => $numResults > 0 && $dbUsers['last'] != $dbUsers['list'][$numResults - 1]['id'],
                                'hasPreviousPage' => $numResults > 0 && $dbUsers['first'] != $dbUsers['list'][0]['id'],
                            ],
                            "edges" => array_map(function($dbUser) {
                                return [
                                    "node" => $dbUser,
                                    "cursor" => $dbUser['id']
                                ];
                            }, $dbUsers['list'])
                        ];
                    }
                ]
            ],
        ]);
    
        SchemaTypes::$successLoginResult = new ObjectType([
            'name' => 'SuccessLoginResult',
            'fields' => [
                'user' => [
                    "type" => SchemaTypes::$userType
                ]
            ]
        ]);
    
        SchemaTypes::$failedLoginReason = new EnumType([
            'name' => 'FailedLoginReason',
            'values' => [
                'INVALID_CREDENTIALS' => [
                    'value' => 0
                ]
            ]
        ]);
    
        SchemaTypes::$failedLoginResult = new ObjectType([
            'name' => 'FailedLoginResult',
            'fields' => [
                'reason' => SchemaTypes::$failedLoginReason
            ]
        ]);
    
        SchemaTypes::$mutationType = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'login' => [
                    'type' => new UnionType([
                        'name' => 'LoginResult',
                        'types' => [
                            SchemaTypes::$successLoginResult,
                            SchemaTypes::$failedLoginResult
                        ],
                        'resolveType' => function($value) {
                            if (array_key_exists('user', $value)) {
                                return SchemaTypes::$successLoginResult;
                            }
                            return SchemaTypes::$failedLoginResult;
                        }
                    ]),
                    'args' => [
                        'email' => Type::nonNull(Type::string()),
                        'password' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function($root, $args) {
                        $_SESSION['user'] = [
                            "id" => 1,
                            "email" => "jan@emmens.nl",
                            "role" => 0
                        ];
                        return [
                            "user" => $_SESSION['user']
                        ];
                     
                        $result = $root['dataContext']->login($args['email'], $args['password']);
                        if(!$result) {
                            return [
                                "reason" => 0
                            ];
                        }

                        $_SESSION['user'] = [
                            "id" => $result["id"],
                            "email" => $result["email"],
                            "role" => $result["role"]
                        ];
                        return [
                            "user" => $_SESSION['user']
                        ];
                    }
                ],
                'logout' => [
                    'type' => Type::nonNull(Type::boolean()),
                    'resolve' => function($root, $args) {
                        $_SESSION['user'] = null;
                        return true;
                    }
                ]
            ]
        ]);
    
        SchemaTypes::$schema = new Schema([
            'query' => SchemaTypes::$queryType,
            'mutation' => SchemaTypes::$mutationType
        ]);
    }
}

SchemaTypes::init();