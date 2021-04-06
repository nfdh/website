<?php

namespace Lib;
use \Lib\Telemetry;

class Database {
    private \PDO $conn;
    private \Lib\Telemetry $telemetry;
    private string $server;

    function __construct($conf, \Lib\Telemetry $telemetry) {
        $this->telemetry = $telemetry;

        $this->server = $server = $conf['server'];
        $database = $conf['database'];
        $dsn = "mysql:host=$server;dbname=$database;charset=utf8mb4";
        $this->conn = new \PDO($dsn, $conf['username'], $conf['password'], array(
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_EMULATE_PREPARES => false
        ));
    }

    function lastInsertId() {
        return $this->conn->lastInsertId();
    }

    function beginTransaction() {
        $this->conn->beginTransaction();
        return new Transaction($this->conn);
    }

    function prepare(string $sql) {
        return new Statement($this->telemetry, $this->server, $this->conn->prepare($sql));
    }

    function execute(string $sql, array $parameters) {
        $statement = $this->prepare($sql);
        return $statement->execute($parameters);
    }

    function queryAll(string $sql, array $parameters) {
        $statement = $this->prepare($sql);
        return $statement->queryAll($parameters);
    }

    function querySingle(string $sql, array $parameters) {
        $statement = $this->prepare($sql);
        return $statement->querySingle($parameters);
    }
}

class Statement {
    private \PDOStatement $stmt;
    private string $server;
    private \Lib\Telemetry $telemetry;

    function __construct(\Lib\Telemetry $telemetry, string $server, \PDOStatement $stmt) {
        $this->stmt = $stmt;
        $this->server = $server;
        $this->telemetry = $telemetry;
    }

    function execute(array $parameters) {
        foreach($parameters as $key => $value) {
            $this->stmt->bindValue($key, $value);
        }

        try {
            $this->stmt->execute();
        }
        catch (Exception $ex) {
            $code = -1;
            if(isset($ex->errorInfo)) {
                $code = $ex->errorInfo[1];
            }

            $this->telemetry->trackDependency($this->server, "SQL", $this->stmt->queryString, time(), $code, false);
            throw $ex;
        }

        $this->telemetry->trackDependency($this->server, "SQL", $this->stmt->queryString, time(), 0, true);
    }

    function queryAll(array $parameters) {
        foreach($parameters as $key => $value) {
            $this->stmt->bindValue($key, $value);
        }

        $result;
        try {
            $this->stmt->execute();
            $result = $this->stmt->fetchAll(\PDO::FETCH_ASSOC);
        }
        catch (Exception $ex) {
            $code = -1;
            if(isset($ex->errorInfo)) {
                $code = $ex->errorInfo[1];
            }

            $this->telemetry->trackDependency($this->server, "SQL", $this->stmt->queryString, time(), $code, false);
            throw $ex;
        }

        $this->telemetry->trackDependency($this->server, "SQL", $this->stmt->queryString, time(), 0, true);
        return $result;
    }

    function querySingle(array $parameters) {
        foreach($parameters as $key => $value) {
            $this->stmt->bindValue($key, $value);
        }

        $result;
        try {
            $this->stmt->execute();
            $result = $this->stmt->fetch(\PDO::FETCH_ASSOC);
        }
        catch (Exception $ex) {
            $code = -1;
            if(isset($ex->errorInfo)) {
                $code = $ex->errorInfo[1];
            }

            $this->telemetry->trackDependency($this->server, "SQL", $this->stmt->queryString, time(), $code, false);
            throw $ex;
        }

        $this->telemetry->trackDependency($this->server, "SQL", $this->stmt->queryString, time(), 0, true);
        return $result;
    }
}

class Transaction {
    private \PDO $conn;

    function __construct(\PDO $conn) {
        $this->conn = $conn;
    }

    function commit() {
        $this->conn->commit();
    }

    function rollback() {
        $this->conn->rollback();
    }
}