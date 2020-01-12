<?php
    ini_set("display_errors", "1");
    error_reporting(E_ALL);

    $times = 3;
    while(true) {
        $sock = fsockopen("unix:///tmp/ssr-server.sock", -1, $errno, $errstr);
        if ($sock) {
            break;
        }

        if ($times == 0) {
            echo "Tried too many times";
            exit(500);
        }

        $desc = array(
            1 => array("file", "/data/sites/web/drentsheideschaapnl/logs/ssr-stdout.log", "a"),  // stdout is a pipe that the child will write to
            2 => array("file", "/data/sites/web/drentsheideschaapnl/logs/ssr-stderr.log", "a"),  // stderr
        );

        $proc = proc_open("/data/sites/web/drentsheideschaapnl/ext-tools/node-v11.15.0-linux-x64/bin/node /data/sites/web/drentsheideschaapnl/ssr/main.js &", $desc, $pipes);
        usleep(200000);
        proc_close($proc);

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

    // Skip the rest of the headers
    while (strlen(fgets($sock)) > 2) { }

    // Read body
    fpassthru($sock);
?>