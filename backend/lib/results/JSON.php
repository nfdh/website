<?php
namespace Lib\Results;

class JSON implements IResult {
    private $obj;

    function __construct($obj) {
        $this->obj = $obj;
    }

    public function execute() {
        header('Content-type: application/json');
        echo json_encode($this->obj);
    }
}