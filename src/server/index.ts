import * as express from 'express';
import * as http from "http";
import * as fetch from "node-fetch";
import * as requestIp from "request-ip";
import { CronJob } from "cron";

import { renderPage } from "./render-page";
import * as paths from "./paths";
import { createQR, readQR, createQRImagePng, removeQR, removeOldQR } from "./qr";
import { createIpFilter } from "./ip-filter";
import { getMin } from "../lib/time-ms";

const _globalThis: any = globalThis;

if (!_globalThis.fetch) {
  _globalThis.fetch = fetch;
}

var job = new CronJob('0 0 0 1-31 * *', () => {
  removeOldQR();
  console.log('QR clean');
}, null, true, 'Europe/Moscow');

job.start();

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(requestIp.mw());
app.use(express.static("dist/client"));
app.get("/favicon.ico", (req, res) => res.sendStatus(404));

// app.get("/create-logo", async () => {
//   await qrcode.toFile("logo.png", "https://once-qr.herokuapp.com/", { type: "png", margin: 0, width: 400 });
// });

const ipFilters = createIpFilter({
  sessionLength: getMin(10),
  countRequests: 100,
});

const ipFilterMw = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    ipFilters.log(req.clientIp);
  } catch (error) {
    res.status(403);
    res.end();
    return;
  }

  console.log(ipFilters.cache);
  next();
};

app.get(paths.createQr(), ipFilterMw);
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
  if (qr) {
    await removeQR(() => {})(req, res);
    res.redirect(qr.originalLink);
    res.end();
  }

  res.redirect(paths.page404());
  res.end();
}));

app.get(paths.all(), async (req, res) => {
  try {
    res.send(await renderPage({ title: "Once QR",
      url: req.url,
    }));
  } catch (error) {}
});

server.listen(port, () => console.log(`http://localhost:${port}`));
