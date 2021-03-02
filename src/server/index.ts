import * as express from 'express';
import * as http from "http";
import * as fetch from "node-fetch";

import { renderPage } from "./render-page";
import * as paths from "./paths";
import { createQR, readQR, createQRImagePng, removeQR } from "./qr";

const _globalThis: any = globalThis;

if (!_globalThis.fetch) {
  _globalThis.fetch = fetch;
}

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static("dist/client"));
app.get("/favicon.ico", (req, res) => res.sendStatus(404));

app.get(paths.createQr(), createQR(({ res, uid }) => {
  if (uid) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ uid }));
    return;
  }

  res.redirect(paths.page404());
  res.end();
}));

app.get(paths.getQrImage(), readQR(async ({ qr, res }) => {
  if (qr) {
    const imagePng = await createQRImagePng(qr.link);
    res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': imagePng.length });
    res.end(imagePng);
    return;
  }

  res.redirect(paths.page404());
  res.end();
}));

app.get(paths.useQr(), readQR(async ({ req, qr, res }) => {
  await removeQR(() => {})(req, res);
  res.redirect(qr.originalLink);
  res.end();
}));

app.get(paths.page404(), (req, res) => {
  res.send("404");
});

app.get(paths.all(), async (req, res) => {
  try {
    res.send(await renderPage({ title: "Once QR",
      url: req.url,
    }));
  } catch (error) {}
});

server.listen(port, () => console.log(`http://localhost:${port}`));
