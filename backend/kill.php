<?php
    exec("/data/sites/web/drentsheideschaapnl/ext-tools/node-v11.15.0-linux-x64/bin/node /data/sites/web/drentsheideschaapnl/ssr/kill.js", $output);

    var_dump($output);
?>