import * as path from "path";
import * as fs from "fs";
import * as net from "net";

import * as express from "express"
import { Server}  from "http";

import * as React from "react"
import * as ReactDOMServer from "react-dom/server"
import { StaticRouter } from 'react-router-dom/server';
import { spawn } from "child_process";

import { App } from "./App";

const socket_path_base = "/data/sites/web/drentsheideschaapnl/tmp";

if(process.argv.length > 2) {
  run_command(process.argv[2]);
}
else {
  const frontendServer = startFrontendServer();
  startControlServer(frontendServer);
}

export const CurrentRequestInfo = {
  statusCode: 200,
  session_id: "",
  cachedResponses: {}
};

function startFrontendServer(): Server {
  const app = express();

  const serverRenderer = (req, res, next) => {
    // Reset the default status code, not found and error pages
    // will update this variable accordingly
    CurrentRequestInfo.statusCode = 200;
    CurrentRequestInfo.session_id = req.headers['x-php-sid']
    CurrentRequestInfo.cachedResponses = {};

    const rendered = ReactDOMServer.renderToString(
      <StaticRouter location={req.originalUrl}>
          <App />
      </StaticRouter>
    );
  
    const cachedResponses = JSON.stringify(CurrentRequestInfo.cachedResponses);

    res.setHeader("X-Html-Content-Length", rendered.length);
    res.status(CurrentRequestInfo.statusCode);
    return res.send(rendered + cachedResponses);
  }
  
  app.use(/^.*/i, serverRenderer);
  
  const socket_path = socket_path_base + "/ssr-server.sock";

  try { fs.unlinkSync(socket_path); }
  catch {}
  
  return app.listen(socket_path, () => {
    console.log(`SSR running on '${socket_path}'`)
  });
}

function startControlServer(frontendServer: Server) {
  const server = net.createServer(function(client: net.Socket) {
    client.setEncoding("utf8");
    client.on("data", function(data: Buffer) {
      client.end();

      const command = data.toString().trim();
      console.log("Received control command: [" + command + "]");

      if (command === "stop") {
        server.close();
        frontendServer.close();
      }
      else if (command === "restart") {
        startSelfOnExit();

        server.close();
        frontendServer.close();
      }
    });
  });

  const socket_path = socket_path_base + "/ssr-server-control.sock";

  try { fs.unlinkSync(socket_path); }
  catch {}

  server.listen(socket_path);
}

function startSelfOnExit() {
  process.on("exit", function() {
    spawn(process.execPath, [__filename], {
      detached: true
    }).unref();
  });
}

function run_command(cmd: string) {
  const socket_path = socket_path_base + "/ssr-server-control.sock";
  const conn = net.createConnection(socket_path, function() {
    conn.write(cmd);
  });
}