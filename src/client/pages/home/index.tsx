import "./index.css";
import * as React from "react";
import { createQr, getQrImage } from "../../../server/paths";
import logo from "./images/logo.png";
import { ReactComponent as Star } from "./images/copy.svg";
import { ReactComponent as Tick } from "./images/tick.svg";
import ClipLoader from "react-spinners/ClipLoader";
import { Page } from "../../ui/templates/page";

const { useState, useEffect } = React;

export const PageHome: React.FC = () => {
  const [link, setLink] = useState("");
  const [qr, setQR] = useState<string>(logo);
  const [linkToQR, setLinkToQR] = useState("https://onceqr.com");
  const [visibleTick, setVisibleTick] = useState(false);
  const [pending, setPending] = useState(false);
  const [visiblePending, setVisiblePending] = useState(false);
  const [timeoutVisiblePending, setTimeoutVisiblePending] = useState<NodeJS.Timeout>(null);

  useEffect(() => {
    if (visibleTick) setTimeout(() => setVisibleTick(false), 2000);
  }, [visibleTick]);

  useEffect(() => {
    if (pending && timeoutVisiblePending === null) {
      setTimeoutVisiblePending(setTimeout(() => setVisiblePending(true), 1000));
    } else if (!pending) {
      clearTimeout(timeoutVisiblePending);
      setVisiblePending(false);
      setTimeoutVisiblePending(null);
    }
  }, [pending, timeoutVisiblePending]);

  useEffect(() => {
    if (link.trim().length === 0) setQR(logo);
  }, [link]);

  return (
    <Page>
      <div className="home__name">
        <div>Once</div>
        <div>QR</div>
      </div>
      <input
        className="home__input-link"
        placeholder="Link"
        title="Double click -> insert from clipboard"
        value={link}
        onChange={(event) => {
          setLink(event.currentTarget.value);
        }}
        onDoubleClick={() => {
          if (link.length) {
            if (link.match(/^(https|http)/) === null) setLink(`http://${link}`);
          } else {
            navigator.clipboard.readText().then(setLink);
          }
        }}
      />
      <button
        className="home__button-create"
        onClick={() => {
          if (link.trim().length) {
            setPending(true);
            fetch(createQr({ link: link.trim() })).then((res) => res.json()).then(({ uid }) => {
              const srcImage = getQrImage({ uid });

              fetch(srcImage).then((res) => res.blob()).then(URL.createObjectURL).then(setQR);
              setLinkToQR(`${window.location.origin}${srcImage}`);
            }).finally(() => setPending(false));
          }
        }}
      >
        {!visiblePending && <span>Create</span>}
        {visiblePending && <ClipLoader size={16} color="teal" />}
      </button>
      <img className="home__logo" alt="Logo" src={qr} />
      <div
        className="home__link-qr-wrapper"
        onClick={() => {
          navigator.clipboard.writeText(linkToQR);
          setVisibleTick(true);
        }}
      >
        {!visibleTick && <Star className="home__icon" />}
        {visibleTick && <Tick className="home__icon" style={{ fill: "teal" }} />}
        <a className="home__link-qr" href="#">Copy link to QR code</a>
      </div>
    </Page>
  );
};
