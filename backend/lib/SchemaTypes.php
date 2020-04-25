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
                'Member' => [
                    'value' => 0
                ]
            ]
        ]);

        SchemaTypes::$userType = new ObjectType([
            'name' => 'User',
            'fields' => [
                'id' => Type::string(),
                'name' => Type::string(),
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

        SchemaTypes::$queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'viewer' => [
                    'type' => SchemaTypes::$viewerType,
                    'resolve' => function ($root, $args) {
                        return [];
                    }
                ],
            ],
        ]);
    
        SchemaTypes::$successLoginResult = new ObjectType([
            'name' => 'SuccessLoginResult',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::nonNull(Type::string())
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
                            if (array_key_exists('id', $value)) {
                                return SchemaTypes::$successLoginResult;
                            }
                            return SchemaTypes::$failedLoginResult;
                        }
                    ]),
                    'args' => [
                        'username' => Type::nonNull(Type::string()),
                        'password' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function($root, $args) {
                        $result = $root['dataContext']->login($args['username'], $args['password']);
                        if(!$result) {
                            return [
                                "reason" => 0
                            ];
                        }

                        $_SESSION['user'] = [
                            "id" => $result["user_id"],
                            "name" => $result["username"],
                            "role" => $result["role"]
                        ];
                        return $_SESSION['user'];
                    }
                ],
                'logout' => [
                    'type' => Type::nonNull(Type::boolean()),
                    'resolve' => function($root, $args) {
                        $_SESSION['user'] = null;
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