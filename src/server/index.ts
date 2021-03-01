import * as express from 'express';
import * as http from "http";
import * as fetch from "node-fetch";
import * as qrcode from 'qrcode';
import { v4 as uuid } from "uuid";
import * as os from "os";

import { getPublicIP } from "./ip";
import { renderPage } from "./render-page";
import * as paths from "./paths";

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

app.get(paths.createQr(), async (req, res) => {
  const link = req.query.link;

  if (typeof link === 'string') {
    // const fullUrl = req.protocol + '://' + getPublicIP() + `:${port}`; // req.get('host'),
    const fullUrl = `${req.protocol}://${req.hostname}`;
    const { uid } = await createQR({ fullUrl, link });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ uid }));
    return;
  }

  res.status(404);
  res.end();
});

const getQr = (callback: (payload: {
  req: express.Request;
  res: express.Response;
  qr: QR
}) => any) => async (req: express.Request, res: express.Response) => {
  const uid = req.params.uid;
  const qr = uid ? readQr({ uid }) : null;

  if (qr) {
    await callback({ req, res, qr });
    return;
  }

  res.redirect(paths.page404());
  res.end();
}

app.get(paths.getQrLink(), getQr(({ qr, res }) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ link: qr.link }));
}));

app.get(paths.getQrImage(), getQr(({ qr, res }) => {
  res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': qr.imagePng.length });
  res.end(qr.imagePng);
}));

app.get(paths.useQr(), getQr(({ qr, res }) => {
  console.log("use qr", qr.originalLink);
  removeLink({ uid: qr.uid });
  res.redirect(qr.originalLink);
  res.end();
}));

app.get(paths.page404(), (req, res) => {
  console.log("404");
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

type QR = { uid: string; originalLink: string; link: string, imagePng: Buffer }

const base: Record<string, QR> = {};

async function createQR(payload: { fullUrl: string; link: string }) {
  const uid = uuid();
  const link = `${payload.fullUrl}${paths.useQr({ uid })}`;
  const qr = {
    uid,
    originalLink: payload.link,
    link,
    imagePng: await creatQRImagePngBuffer({ link: link }),
  };

  base[uid] = qr;

  return qr;
}

function creatQRImagePngBuffer(payload: {link: string}): Promise<Buffer> {
  return new Promise((resolve) => {
    qrcode.toDataURL(payload.link, { type: "image/png", margin: 0, width: 400 }, (err, url) => {
      resolve(Buffer.from(url.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64'));
    });
  });
}

function readQr(payload: { uid: string }) {
  const qr = base[payload.uid]

  if (qr) {
    return qr;
  }

  return null;
}

function removeLink(payload: { uid: string }) {
  if (base[payload.uid]) {
    delete base[payload.uid];
  }
}
