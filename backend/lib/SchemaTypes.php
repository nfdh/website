<?php

namespace Lib;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\UnionType;
use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\CustomScalarType;
use GraphQL\Type\Schema;

class SchemaTypes {
	public static $dateType;
    public static $userRoleType;
	public static $userType;
	public static $userInput;
    public static $pageInfoType;
    public static $usersConnectionType;
    public static $usersEdgeType;
	public static $viewerType;
	public static $studbookType;
	public static $studbookMembershipType;
	public static $studbookMembershipInput;
	public static $dekverklaringenConnectionType;
	public static $dekverklaringenEdgeType;
	public static $dekverklaringType;
	public static $dekgroepInputType;
	public static $dekverklaringInputType;
    public static $queryType;
    public static $successLoginResult;
    public static $failedLoginReason;
	public static $failedLoginResult;
	public static $successSendDekverklaringResult;
	public static $failedSendDekverklaringReason;
	public static $failedSendDekverklaringResult;
	public static $successAddUserResult;
	public static $failedAddUserReason;
	public static $failedAddUserResult;
    public static $successUpdateUserResult;
	public static $failedUpdateUserReason;
	public static $failedUpdateUserResult;
    public static $mutationType;
    public static $schema;

	static function init() {
		SchemaTypes::$dateType = new CustomScalarType([				
			'name' => 'Date',
			'serialize' => function($value) { return $value->format(\DateTime::ISO8601); },
			'parseValue' => function($value) { return \DateTime::createFromFormat(\DateTime::ISO8601, $value); },
			'parseLiteral' => function($valueNode, array $variables = null) {
				if (!$valueNode instanceof StringValueNode) {
            		throw new Error('Query error: Can only parse strings got: ' . $valueNode->kind, [$valueNode]);
				}
				return \DateTime::createFromFormat(\DateTime::ISO8601, $valueNode->value);
			},
		]);

        SchemaTypes::$userRoleType = new EnumType([
            'name' => 'UserRole',
            'values' => [
                'MEMBER' => [
                    'value' => 0
                ]
            ]
        ]);

		SchemaTypes::$studbookMembershipType = new ObjectType([
			'name' => 'StudbookMembership',
			'fields' => [
				'ko' => Type::nonNull(Type::boolean())
			]
		]);

        SchemaTypes::$studbookMembershipInput = new InputObjectType([
            'name' => 'StudbookMembershipInput',
            'fields' => [
                'ko' => Type::nonNull(Type::boolean())
            ]
        ]);

        SchemaTypes::$userType = new ObjectType([
            'name' => 'User',
            'fields' => [
                'id' => Type::id(),
                'name' => Type::string(),
                'email' => Type::string(),
                'studbook_heideschaap' => SchemaTypes::$studbookMembershipType,
                'studbook_schoonebeeker' => SchemaTypes::$studbookMembershipType,
                'role_website_contributor' => Type::nonNull(Type::boolean()),
                'role_studbook_administrator' => Type::nonNull(Type::boolean()),
                'role_studbook_inspector' => Type::nonNull(Type::boolean())
            ],
        ]);

        SchemaTypes::$userInput = new InputObjectType([
            'name' => 'UserInput',
            'fields' => [
                'name' => Type::string(),
                'email' => Type::string(),
                'studbook_heideschaap' => SchemaTypes::$studbookMembershipInput,
                'studbook_schoonebeeker' => SchemaTypes::$studbookMembershipInput,
                'role_website_contributor' => Type::nonNull(Type::boolean()),
                'role_studbook_administrator' => Type::nonNull(Type::boolean()),
                'role_studbook_inspector' => Type::nonNull(Type::boolean())
            ],
        ]);

		SchemaTypes::$pageInfoType = new ObjectType([
            'name' => 'PageInfo',
            'fields' => [
                'hasPreviousPage' => Type::nonNull(Type::boolean()),
                'hasNextPage' => Type::nonNull(Type::boolean()),
                'startCursor' => Type::id(),
                'endCursor' => Type::id()
            ]
		]);

        SchemaTypes::$studbookType = new EnumType([
			'name' => 'Studbook',
			'values' => [
				'DRENTS_HEIDESCHAAP' => [
					'value' => 0
				],
				'SCHOONEBEEKER' => [
					'value' => 1
				]
			]
		]);
		SchemaTypes::$dekverklaringType = new ObjectType([
			'name' => 'Dekverklaring',
			'fields' => [
				'id' => Type::id(),
				'season' => Type::int(),
				'studbook' => SchemaTypes::$studbookType,
				'date_sent' => SchemaTypes::$dateType,
				'date_corrected' => SchemaTypes::$dateType
			]
		]);

		SchemaTypes::$dekgroepInputType = new InputObjectType([
			'name' => 'DekgroepInput',
			'fields' => [
				'ewe_count' => Type::nonNull(Type::int()),
				'rammen' => Type::listOf(Type::nonNull(Type::string()))
			]
		]);

		SchemaTypes::$dekverklaringInputType = new InputObjectType([
			'name' => 'DekverklaringInput',
			'fields' => [
				'season' => Type::nonNull(Type::int()),
				'name' => Type::nonNull(Type::string()),
                'studbook' => Type::nonNull(SchemaTypes::$studbookType),
				'kovo' => Type::nonNull(Type::int()),
				'koe' => Type::nonNull(Type::int()),
				'kool' => Type::nonNull(Type::int()),
				'korl' => Type::nonNull(Type::int()),
				'dekgroepen' => Type::listOf(SchemaTypes::$dekgroepInputType),
				'remarks' => Type::nonNull(Type::string())
			]
		]);

        SchemaTypes::$dekverklaringenEdgeType = new ObjectType([
            'name' => 'DekverklaringenEdge',
            'fields' => [
                'node' => SchemaTypes::$dekverklaringType,
                'cursor' => Type::nonNull(Type::id())
            ]
        ]);

        SchemaTypes::$dekverklaringenConnectionType = new ObjectType([
            'name' => 'DekverklaringenConnection',
            'fields' => [
                'pageInfo' => SchemaTypes::$pageInfoType,
                'edges' => Type::listOf(SchemaTypes::$dekverklaringenEdgeType)
            ]
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
				'dekverklaringen' => [
                    'type' => SchemaTypes::$dekverklaringenConnectionType,
                    'args' => [
                        'first' => Type::nonNull(Type::int()),
                        'after' => Type::string()
                    ],
					'resolve' => function ($root, $args, $context) {
						$user = $_SESSION['user'];

						$dbForms = $context['dataContext']->get_dekverklaringen_of_user($user['id'], $args['first'], $args['after'] ?? null);

                        $numTotal = $dbForms['totalCount'];
                        $numResults = sizeof($dbForms['list']);

						return [
                            "totalCount" => $numTotal,
                            "pageInfo" => [
                                'startCursor' => $dbForms['first'],
                                'endCursor' => $dbForms['last'],
                                'hasNextPage' => $numResults > 0 && $dbForms['last'] != $dbForms['list'][$numResults - 1]['id'],
                                'hasPreviousPage' => $numResults > 0 && $dbForms['first'] != $dbForms['list'][0]['id'],
                            ],
                            "edges" => array_map(function($dbForm) {
                                return [
                                    "node" => $dbForm,
                                    "cursor" => $dbForm['id']
                                ];
                            }, $dbForms['list'])
                        ];
                    }
 
				]
            ],
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
                'user' => [
                    'type' => SchemaTypes::$userType,
                    'args' => [
                        'id' => Type::nonNull(Type::id())
                    ],
                    'resolve' => function($root, $args, $context) {
                        // TODO: Check authorization

                        $dbUser = $context['dataContext']->get_user($args['id']);
                        if (!$dbUser) {
                            return null;
                        }

                        return [
                            "id" => $args['id'],
                            "email" => $dbUser["email"],
                            "name" => $dbUser["name"],

                            "studbook_heideschaap" => $dbUser["studbook_heideschaap"]
                                ? [ "ko" => $dbUser["studbook_heideschaap_ko"] ]
                                : null,

                            "studbook_schoonebeeker" => $dbUser["studbook_schoonebeeker"]
                                ? [ "ko" => $dbUser["studbook_schoonebeeker_ko"] ]
                                : null,

                            "role_website_contributor" => $dbUser["role_website_contributor"],
                            "role_studbook_administrator" => $dbUser["role_studbook_administrator"],
                            "role_studbook_inspector" => $dbUser["role_studbook_inspector"]
                        ];
                    }
                ],
                'users' => [
                    'type' => SchemaTypes::$usersConnectionType,
                    'args' => [
                        'searchTerm' => Type::string(),
                        'first' => Type::nonNull(Type::int()),
                        'after' => Type::string()
                    ],
                    'resolve' => function ($root, $args, $context) {
                        $dbUsers = $context['dataContext']->get_users($args['searchTerm'], $args['first'], $args['after'] ?? null);

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
                'UNKNOWN' => [
                    'value' => 0
                ],
                'INVALID_CREDENTIALS' => [
                    'value' => 1
                ]
            ]
        ]);
    
        SchemaTypes::$failedLoginResult = new ObjectType([
            'name' => 'FailedLoginResult',
            'fields' => [
                'reason' => SchemaTypes::$failedLoginReason
            ]
        ]);

		SchemaTypes::$successSendDekverklaringResult = new ObjectType([
			'name' => 'SuccessSendDekverklaringResult',
			'fields' => [
				'dekverklaring' => SchemaTypes::$dekverklaringType
			]
		]);

		SchemaTypes::$failedSendDekverklaringReason = new EnumType([
			'name' => 'FailedSendDekverklaringReason',
			'values' => [
				'UNKNOWN' => [
					'value' => 0
				]
			]
		]);

		SchemaTypes::$failedSendDekverklaringResult = new ObjectType([
			'name' => 'FailedSendDekverklaringResult',
			'fields' => [
				'reason' => SchemaTypes::$failedSendDekverklaringReason
			]
		]);

		SchemaTypes::$successAddUserResult = new ObjectType([
			'name' => 'SuccessAddUserResult',
			'fields' => [
				'user' => SchemaTypes::$userType
			]
		]);

		SchemaTypes::$failedAddUserReason = new EnumType([
			'name' => 'FailedAddUserReason',
			'values' => [	
				'UNKNOWN' => [
					'value' => 0
				],
				'UNAUTHORIZED' => [
					'value' => 1
                ],
                'EMAIL_IN_USE' => [
                    'value' => 2
                ]
			]
		]);

		SchemaTypes::$failedAddUserResult = new ObjectType([
			'name' => 'FailedAddUserResult',
			'fields' => [
				'reason' => SchemaTypes::$failedAddUserReason
			]	
		]);

        SchemaTypes::$successUpdateUserResult = new ObjectType([
			'name' => 'SuccessUpdateUserResult',
			'fields' => []
		]);

		SchemaTypes::$failedUpdateUserReason = new EnumType([
			'name' => 'FailedUpdateUserReason',
			'values' => [	
				'UNKNOWN' => [
					'value' => 0
				],
				'UNAUTHORIZED' => [
					'value' => 1
                ],
                'EMAIL_IN_USE' => [
                    'value' => 2
                ]
			]
		]);

		SchemaTypes::$failedUpdateUserResult = new ObjectType([
			'name' => 'FailedUpdateUserResult',
			'fields' => [
				'reason' => SchemaTypes::$failedUpdateUserReason
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
                    'resolve' => function($root, $args, $context) {                     
                        $result = $context['dataContext']->login($args['email'], $args['password']);
                        if(!$result) {
                            return [
                                "reason" => 1
                            ];
                        }

                        $_SESSION['user'] = [
							"id" => $result["id"],
							"name" => $result["name"],
                            "email" => $result["email"],
                    		
							"role_website_contributor" => $result["role_website_contributor"],
							"role_studbook_administrator" => $result["role_studbook_administrator"],
							"role_studbook_inspector" => $result["role_studbook_inspector"]
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
                ],
				'sendDekverklaring' => [
					'type' => new UnionType([
						'name' => 'SendDekverklaringResult',
						'types' => [
                            SchemaTypes::$successSendDekverklaringResult,
                            SchemaTypes::$failedSendDekverklaringResult
                        ],
                        'resolveType' => function($value) {
                            if (array_key_exists('dekverklaring', $value)) {
                                return SchemaTypes::$successSendDekverklaringResult;
                            }
                            return SchemaTypes::$failedSendDekverklaringResult;
                        }
					]),
					'args' => [
                        'dekverklaring' => Type::nonNull(SchemaTypes::$dekverklaringInputType)
                    ],
					'resolve' => function($root, $args, $context) {
						$user = $_SESSION['user'];
						$result = $context['dataContext']->add_dekverklaring($user['id'], $args['dekverklaring']);

						// TODO: Create PDF and send emails

						return [
							'dekverklaring' => $result
						];
					} 
				],
                'addUser' => [
                    'type' => new UnionType([
                        'name' => 'AddUserResult',
                        'types' => [
                            SchemaTypes::$successAddUserResult,
                            SchemaTypes::$failedAddUserResult
                        ],
                        'resolveType' => function($value) {
                            if (array_key_exists('user', $value)) {
                                return SchemaTypes::$successAddUserResult;
                            }
                            return SchemaTypes::$failedAddUserResult;
                        }
                    ]),
                    'args' => [
                        'user' => Type::nonNull(SchemaTypes::$userInput)
                    ],
					'resolve' => function($root, $args, $context) {
						// TODO: Check if current user is authorized
						
                        // TODO: Generate password and send by mail
                        $password = "test";

                        $user = [
                            "email" => $args["user"]["email"],
                            "password" => $password,
                            "name" => $args["user"]["name"],
                            "studbook_heideschaap" => $args["user"]["studbook_heideschaap"] != null,
                            "studbook_heideschaap_ko" => $args["user"]["studbook_heideschaap"] != null
                                && $args["user"]["studbook_heideschaap"]["ko"],
                            "studbook_schoonebeeker" => $args["user"]["studbook_schoonebeeker"] != null,
                            "studbook_schoonebeeker_ko" => $args["user"]["studbook_schoonebeeker"] != null 
                                && $args["user"]["studbook_heideschaap"]["ko"],

                            "role_website_contributor" => $args["user"]["role_website_contributor"],
                            "role_studbook_administrator" => $args["user"]["role_studbook_administrator"],
                            "role_studbook_inspector" => $args["user"]["role_studbook_inspector"]
                        ];

                        $result = null;
                        try {
                            $result = $context['dataContext']->add_user($user);
                        }
                        catch (\PDOException $e) {
                            if ($e->errorInfo[1] == 1062) {
                                return [
                                    "reason" => 2
                                ];
                            }
                        }

                        if(!$result) {
                            return [
                                "reason" => 0
                            ];
                        }

                        return [
                            "user" => [
                                "id" => $result['id']
                            ]
                        ];
                    }
                ],
                'updateUser' => [
                    'type' => new UnionType([
                        'name' => 'UpdateUserResult',
                        'types' => [
                            SchemaTypes::$successUpdateUserResult,
                            SchemaTypes::$failedUpdateUserResult
                        ],
                        'resolveType' => function($value) {
                            if (array_key_exists('reason', $value)) {
                                return SchemaTypes::$failedUpdateUserResult;
                            }
                            return SchemaTypes::$successUpdateUserResult;
                        }
                    ]),
                    'args' => [
                        'id' => Type::nonNull(Type::id()),
                        'user' => Type::nonNull(SchemaTypes::$userInput)
                    ],
					'resolve' => function($root, $args, $context) {
						// TODO: Check if current user is authorized
						
                        $user = [
                            "email" => $args["user"]["email"],
                            "name" => $args["user"]["name"],
                            "studbook_heideschaap" => $args["user"]["studbook_heideschaap"] != null,
                            "studbook_heideschaap_ko" => $args["user"]["studbook_heideschaap"] != null
                                && $args["user"]["studbook_heideschaap"]["ko"],
                            "studbook_schoonebeeker" => $args["user"]["studbook_schoonebeeker"] != null,
                            "studbook_schoonebeeker_ko" => $args["user"]["studbook_schoonebeeker"] != null 
                                && $args["user"]["studbook_heideschaap"]["ko"],

                            "role_website_contributor" => $args["user"]["role_website_contributor"],
                            "role_studbook_administrator" => $args["user"]["role_studbook_administrator"],
                            "role_studbook_inspector" => $args["user"]["role_studbook_inspector"]
                        ];

                        $result = null;
                        try {
                            $result = $context['dataContext']->update_user($args['id'], $user);
                        }
                        catch (\PDOException $e) {
                            if ($e->errorInfo[1] == 1062) {
                                return [
                                    "reason" => 2
                                ];
                            }
                        }

                        if(!$result) {
                            return [
                                "reason" => 0
                            ];
                        }

                        return [];
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
