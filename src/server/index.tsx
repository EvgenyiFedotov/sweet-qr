import * as express from 'express';
import * as http from "http";
import * as ReactDOMServer from "react-dom/server";
import * as React from 'react';
import { context, serializeContext } from "store-api";
import { StaticRouter } from "react-router-dom";
import * as fetch from "node-fetch";

import { html } from "../client/html";
import { App } from "../client/app";

const _globalThis: any = globalThis;

if (!_globalThis.fetch) {
  _globalThis.fetch = fetch;
}

const port = 5000;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static("dist/client"));
app.get("/favicon.ico", (req, res) => res.sendStatus(404));

const renderPage = async (payload: {
  title?: string;
  url: string;
}) => {
  const routerContext = {};

  const content = ReactDOMServer.renderToString(
    <StaticRouter location={payload.url} context={routerContext}>
      <App />
    </StaticRouter>
  );

  return html({ title: payload.title, content });
};

app.get("*", async (req, res) => {
  try {
    res.send(await renderPage({
      title: "Home",
      url: req.url,
    }));
  } catch (error) {}
});

server.listen(port, () => console.log(`http://localhost:${port}`));
