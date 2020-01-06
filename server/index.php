<?php
    ini_set("display_errors", "1");
    error_reporting(E_ALL);

    function render_page() {
        $times = 3;
        while(true) {
            $sock = fsockopen("unix:///tmp/ssr-server.sock", -1, $errno, $errstr);
            if ($sock) {
                break;
            }

            if ($times == 0) {
                // TODO: Error out
                echo "Tried too many times";
                exit(500);
            }

            $desc = array(
                0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
                1 => array("file", "/data/sites/web/drentsheideschaapnl/ssr/stdout.log", "a"),  // stdout is a pipe that the child will write to
                2 => array("file", "/data/sites/web/drentsheideschaapnl/ssr/stderr.log", "a"),  // stderr
            );

            $proc = proc_open("/data/sites/web/drentsheideschaapnl/ext-tools/node-v11.15.0-linux-x64/bin/node /data/sites/web/drentsheideschaapnl/ssr/main.js &", $desc, $pipes);
            echo "Exited with: " . proc_close($proc);
            usleep(200000);

            $times--;
        }

        $original_url = $_SERVER['REQUEST_URI'];

        $req = "GET $original_url HTTP/1.1\r\n";
        $req .= "Host: localhost\r\n";
        $req .= "Connection: close\r\n\r\n";
        fwrite($sock, $req);

        // Read response headers
        $status = fgets($sock);
        $status_parts = explode(" ", $status);

        header($status, true, intval($status_parts[1]));

        while (strlen(fgets($sock)) > 2) { }

        ob_end_flush();

        // Read body
        fpassthru($sock);
    }

    ob_start();

    include("_template.php");
?>