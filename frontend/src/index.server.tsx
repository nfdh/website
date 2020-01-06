import * as path from "path";
import { unlinkSync } from "fs";

import express from "express"
import * as React from "react"
import * as ReactDOMServer from "react-dom/server"
import { StaticRouter } from 'react-router-dom';

import { App } from "./App";

const app = express();

const serverRenderer = (req, res, next) => {
  const context = { statusCode: 200 };
  const rendered = ReactDOMServer.renderToString(
    <StaticRouter location={req.originalUrl} context={context}>
        <App />
    </StaticRouter>
  );

  res.status(context.statusCode);
  return res.send(
    rendered  
  );
}

app.use(
  "/static",
  express.static(path.resolve(".", "dist-client", "static"), { maxAge: '30d' })
);

app.use(/^.*/i, serverRenderer);


unlinkSync("/tmp/ssr-server.sock");

app.listen("/tmp/ssr-server.sock", () => {
  console.log(`SSR running on '/tmp/ssr-server'`)
});