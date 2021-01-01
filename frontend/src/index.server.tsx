import * as path from "path";
import * as fs from "fs";
import * as net from "net";

import * as express from "express"
import { Server}  from "http";

import * as React from "react"
import * as ReactDOMServer from "react-dom/server"
import { StaticRouter } from 'react-router-dom/server';
import { spawn } from "child_process";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { Environment, RequestParameters, CacheConfig, UploadableMap, Network, Store, RecordSource } from "relay-runtime";

import { App } from "./App";

//const socket_path_base = "/home/jan/nfdh_root/tmp";
const socket_path_base = "/data/sites/web/drentsheideschaapnl/tmp";

if(process.argv.length > 2) {
  run_command(process.argv[2]);
}
else {
  const frontendServer = startFrontendServer();
  startControlServer(frontendServer);
}

export const CurrentRequestInfo = {
  statusCode: 200
};

function startFrontendServer(): Server {
  const app = express();

  const serverRenderer = async (req, res, next) => {
    // Reset the default status code, not found and error pages
    // will update this variable accordingly
    CurrentRequestInfo.statusCode = 200;

    const fetchContext: FetchContext = {
      promises: [],
      sessionId: req.headers['x-php-sid'],
      cachedResponses: {}
    };

    const source = new RecordSource();
    const store = new Store(source);
    const network = Network.create(fetchRelay.bind(fetchContext)); 
    
    const env = new Environment({
        network,
        store,
    });    

    let rendered = ReactDOMServer.renderToString(render_element(req.originalUrl, env));

    // Recursively wait for any pending requests
    while (fetchContext.promises.length > 0) {
      await Promise.all(fetchContext.promises);
      fetchContext.promises = [];

      rendered = ReactDOMServer.renderToString(render_element(req.originalUrl, env));
    }

    res.status(CurrentRequestInfo.statusCode);
    res.write(rendered);

    const cachedResponses = JSON.stringify(fetchContext.cachedResponses);
    res.write(cachedResponses);
    res.end();
  }
  
  app.use(/^.*/i, serverRenderer);
  
  const socket_path = socket_path_base + "/ssr-server.sock";

  try { fs.unlinkSync(socket_path); }
  catch {}
  
  return app.listen(socket_path, () => {
    console.log(`SSR running on '${socket_path}'`)
  });
}

function render_element(url: string, env: Environment) {
  return <RelayEnvironmentProvider environment={env}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
  </RelayEnvironmentProvider>
}

interface FetchContext {
  promises: Promise<any>[],
  sessionId: string,
  cachedResponses: { [key: string]: any }
}

function fetchRelay(this: FetchContext, params: RequestParameters, variables: any, cacheConfig: CacheConfig, uploadables?: UploadableMap | null): Promise<any> {
  const fetchContext = this;

  const promise = new Promise(function(resolve, reject) {
      const http = require('http');

      const body = JSON.stringify({
          query: params.text,
          variables
      });

      const options = {
          //hostname: 'nieuw.drentsheideschaap.nl',
          hostname: 'localhost',
	  port: 8080,
          path: '/query',
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              "Content-Length": body.length,
              "Cookie": "PHPSESSID=" + fetchContext.sessionId
          }
      };

      const req = http.request(options, res => {
          if (res.statusCode !== 200) {
              reject("Unexpected status code " + res.statusCode);
          }
          else {
              const chunks = [];
              res.on('data', chunk => {
                  chunks.push(chunk);
              });

              res.on("end", function() {
                  const result_text = chunks.join();
                  const result = JSON.parse(result_text);
                  
                  fetchContext.cachedResponses[params.name] = result;
                  
                  resolve(result);
              });
          }
      });

      req.on('error', error => {
          reject(error);
      });

      req.write(body);
      req.end();
  });
  fetchContext.promises.push(promise);
  return promise;
};

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
