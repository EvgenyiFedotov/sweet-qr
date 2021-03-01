import "./index.css";
import * as React from "react";
import { createQr, getQrLink, getQrImage } from "../../../server/paths";
import logo from "./images/logo.png";

const { useState } = React;

export const PageHome: React.FC = () => {
  const [link, setLink] = useState("");
  const [qr, setQR] = useState<string>(logo);
  const [linkToQR, setLinkToQR] = useState("https://onceqr.com");

  return (
    <div className="home__container">
      <div className="home__name">
        <div>Once</div>
        <div>QR</div>
      </div>
      <input className="home__input-link" placeholder="Link" value={link} onChange={(event) => {
        setLink(event.currentTarget.value);
      }} />
      <button className="home__button-create" onClick={() => {
        fetch(createQr({ link })).then((res) => res.json()).then(({ uid }) => {
          const srcImage = getQrImage({ uid });

          fetch(srcImage).then((res) => res.blob()).then(URL.createObjectURL).then(setQR);
          setLinkToQR(`${window.location.origin}${srcImage}`);
        });
      }}>Create</button>
      <img className="home__logo" alt="Logo" src={qr} />
      <div className="home__link-qr-wrapper">
        <a className="home__link-qr" href="#" onClick={() => {
          navigator.clipboard.writeText(linkToQR);
        }}>Copy link to qr code</a>
      </div>
    </div>
  );
};
