<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo "\n";
    return;
}

require __DIR__ . "/lib/vendor/autoload.php";

use GraphQL\GraphQL;
use Conf\Settings;
use Lib\DataContext;
use Lib\SchemaTypes;

session_start();

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
$query = $input['query'];
$variableValues = isset($input['variables']) ? $input['variables'] : null;

$conf = Settings::get();

// Connect to the database
$rootValue = [ "dataContext" => new DataContext($conf['db_server'], $conf['db_username'], $conf['db_password'], $conf['db_database']) ];

$result = GraphQL::executeQuery(SchemaTypes::$schema, $query, $rootValue, null, $variableValues);
foreach ($result->errors as $error) {
    error_log("Caught " . $error);
}

$output = $result->toArray();

header('Content-Type: application/json');
echo json_encode($output);
echo "\n";
?>
