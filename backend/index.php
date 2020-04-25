<?php
    session_start();

    if(isset($_COOKIE['errors'])) {
        ini_set("display_errors", "1");
        error_reporting(E_ALL);
    }

    // Allow sending commands to SSR server
    if (isset($_GET['ssr'])) {
        $sock = fsockopen("unix:///data/sites/web/drentsheideschaapnl/tmp/ssr-server-control.sock");
        fwrite($sock, $_GET['ssr']);
        fclose($sock);

        echo "Command '" . $_GET['ssr'] . "' send to SSR server.";
        exit();
    }

    $template = file_get_contents("template.html");
    $template_content_start = strpos($template, "</div>");
    $template_script_start = strpos($template, "<script");

    $times = 3;
    while(true) {
        $sock = fsockopen("unix:///data/sites/web/drentsheideschaapnl/tmp/ssr-server.sock", -1, $errno, $errstr);
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
    $req .= "X-PHP-SID: " . session_id() . "\r\n";
    $req .= "Connection: close\r\n\r\n";
    fwrite($sock, $req);

    // Read response headers
    $status = fgets($sock);
    $status_parts = explode(" ", $status);

    header($status, true, intval($status_parts[1]));

    $htmlContentLen = 0;
    while (strlen($line = fgets($sock)) > 2) {
        $hdr = "X-Html-Content-Length:";

        if (strncmp($line, $hdr, strlen($hdr)) === 0) {
            $htmlContentLen = intval(substr($line, strlen($hdr)));
        }
    }

    // Output the template intermittend with output data
    echo substr($template, 0, $template_content_start);
    echo stream_get_contents($sock, $htmlContentLen);
    echo substr($template, $template_content_start, $template_script_start - $template_content_start);
    echo '<script type="text/javascript">window.__SSR_DATA__=';
    echo stream_get_contents($sock);
    echo '</script>';
    echo substr($template, $template_script_start);
?>