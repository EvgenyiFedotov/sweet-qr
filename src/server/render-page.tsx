import * as ReactDOMServer from "react-dom/server";
import * as React from 'react';
import { StaticRouter } from "react-router-dom";

import { App } from "../client/app";
import { html } from "../client/html";

export const renderPage = async (payload: {
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
