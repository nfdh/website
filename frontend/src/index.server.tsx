import * as path from "path";
import * as fs from "fs";
import * as net from "net";

import * as express from "express"
import { Server}  from "http";

import * as React from "react"
import * as ReactDOMServer from "react-dom/server"
import { StaticRouter } from 'react-router-dom';
import { spawn } from "child_process";

import { App } from "./App";

if(process.argv.length > 2) {
  run_command(process.argv[2]);
}
else {
  const frontendServer = startFrontendServer();
  startControlServer(frontendServer);
}

function startFrontendServer(): Server {
  const app = express();

  const serverRenderer = (req, res, next) => {
    const context = { statusCode: 200 };
    const rendered = ReactDOMServer.renderToString(
      <StaticRouter location={req.originalUrl} context={context}>
          <App />
      </StaticRouter>
    );
  
    res.status(context.statusCode);
    return res.send(rendered);
  }
  
  app.use(/^.*/i, serverRenderer);
  
  try { fs.unlinkSync("/tmp/ssr-server.sock"); }
  catch {}
  
  return app.listen("/tmp/ssr-server.sock", () => {
    console.log(`SSR running on '/tmp/ssr-server.sock'`)
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

  try { fs.unlinkSync("/tmp/ssr-server-control.sock"); }
  catch {}

  server.listen("/tmp/ssr-server-control.sock");
}

function startSelfOnExit() {
  process.on("exit", function() {
    spawn(process.execPath, [__filename], {
      detached: true
    }).unref();
  });
}

function run_command(cmd: string) {
  const conn = net.createConnection("/tmp/ssr-server-control.sock", function() {
    conn.write(cmd);
  });
}