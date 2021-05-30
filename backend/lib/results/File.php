<?php
namespace Lib\Results;

class File implements IResult {
    private string $path;
    private string $contentType;
    private string|null $downloadName;

    function __construct(string $path, string $contentType, string|null $downloadName = null) {
        $this->path = $path;
        $this->contentType = $contentType;
        $this->downloadName = $downloadName;
    }

    public function execute() {
        header('Content-Type: ' . $this->contentType);
        header('Content-Length: ' . filesize($this->path));

        if($this->downloadName != null) {
            header('Content-Disposition: attachment; filename="' . $this->downloadName . '"');
        }

        readfile($this->path);
    }
}