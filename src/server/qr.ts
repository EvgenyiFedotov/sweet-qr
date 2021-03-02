import { read, remove, write } from "lib/database";
import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import * as paths from "./paths";
import * as qrcode from "qrcode";

type QR = { originalLink: string; link: string };

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
    qr = { originalLink, link: `${req.protocol}://${req.hostname}${paths.useQr({ uid })}` };
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
}