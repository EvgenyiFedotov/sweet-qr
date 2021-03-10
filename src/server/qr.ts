import { read, remove, write, entries } from "lib/database";
import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import * as paths from "./paths";
import * as qrcode from "qrcode";
import { getDay } from "../lib/time-ms";

type QR = { originalLink: string; link: string, created: number };

type CallbackQR = (payload: { req: Request, res: Response, qr: QR | null, uid: string | null }) => any;

type RequestWrapper = (callback: CallbackQR) => (req: Request, res: Response) => Promise<any>;

export const createQRImagePng = async (link: string): Promise<Buffer> => new Promise((resolve) => {
  qrcode.toDataURL(link, { type: "image/png", margin: 0, width: 400 }, (err, url) => {
    resolve(Buffer.from(url.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64'));
  });
});

export const createQR: RequestWrapper = (callback) => async (req, res) => {
  const originalLink = req.query.link ?? null;
  let qr: QR | null = null;
  let uid: string | null = null;

  if (typeof originalLink === "string") {
    uid = uuid();
    qr = {
      originalLink,
      link: `${req.protocol}://${req.hostname}${paths.useQr({ uid })}`,
      created: new Date().getTime(),
    };
    write(uid, qr);
  }

  await callback({ req, res, uid, qr });
};

export const readQR: RequestWrapper = (callback) => async (req, res) => {
  const uid = req.params.uid ?? null
  await callback({ req, res, uid, qr: read(uid) });
};

export const removeQR: RequestWrapper = (callback) => async (req, res) => {
  const uid = req.params.uid ?? null;
  remove(uid);
  await callback({ req, res, uid, qr: read(uid) });
};

const maxDays = getDay(7);

export const removeOldQR = () => {
  const now = new Date().getTime();
  const keys: string[] = [];

  entries().forEach(([key, { created }]) => {
    if (now - created >= maxDays) keys.push(key);
  });

  keys.forEach(remove);
};
