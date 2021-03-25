<?php
    session_start();
    session_write_close();

    //$base_path = "/home/jan/nfdh_root";
    $base_path = "/data/sites/web/drentsheideschaapnl";

    if(isset($_COOKIE['errors'])) {
        ini_set("display_errors", "1");
        error_reporting(E_ALL);
    }

    // Allow sending commands to SSR server
    if (isset($_GET['ssr'])) {
        $sock = fsockopen("unix://$base_path/tmp/ssr-server-control.sock");
        fwrite($sock, $_GET['ssr']);
        fclose($sock);

        echo "Command '" . $_GET['ssr'] . "' send to SSR server.";
        exit();
    }

    $template = file_get_contents("template.html");
    $template_content_start = strpos($template, "</div>");
    $template_script_start = $template_content_start + 6;

    $times = 3;
    while(true) {
        $sock = fsockopen("unix://$base_path/tmp/ssr-server.sock", -1, $errno, $errstr);
        if ($sock) {
            break;
        }

        if ($times == 0) {
            echo "Tried too many times";
            exit(500);
        }

        $desc = array(
            1 => array("file", "$base_path/logs/ssr-stdout.log", "a"),  // stdout is a pipe that the child will write to
            2 => array("file", "$base_path/logs/ssr-stderr.log", "a"),  // stderr
        );

        $proc = proc_open("$base_path/ext-tools/node-v11.15.0-linux-x64/bin/node $base_path/ssr/main.js &", $desc, $pipes);
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

    while (strlen($line = fgets($sock)) > 2) { }

    // Output the template intermittend with output data
	echo substr($template, 0, $template_content_start);
    
    $rendered_len = intval(fgets($sock), 16);
	echo stream_get_contents($sock, $rendered_len);
    fgets($sock);

	echo substr($template, $template_content_start, $template_script_start - $template_content_start);
	echo '<script type="text/javascript">window.__SSR_DATA__=';
    
	$response_cache_len = intval(fgets($sock), 16);
    echo stream_get_contents($sock, $response_cache_len);
    fgets($sock);

	echo '</script>';
	echo substr($template, $template_script_start);
?>
