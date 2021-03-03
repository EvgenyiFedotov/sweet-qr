import "./index.css";
import * as React from "react";
import { createQr, getQrImage } from "../../../server/paths";
import logo from "./images/logo.png";
import { ReactComponent as Star } from "./images/copy.svg";
import { ReactComponent as Tick } from "./images/tick.svg";
import { Page } from "../../ui/templates/page";
import { Button } from '../../ui/atoms/button';
import { PageColumn } from "../../ui/templates/page-column";

const { useState, useEffect } = React;

export const PageHome: React.FC = () => {
  const side = useIsSide();
  const [link, setLink] = useState("");
  const [qr, setQR] = useState<string>(logo);
  const [linkToQR, setLinkToQR] = useState("https://onceqr.com");
  const [visibleTick, setVisibleTick] = useState(false);
  const [pending, setPending] = useState(false);
  const [visiblePending, setVisiblePending] = useState(false);
  const [timeoutVisiblePending, setTimeoutVisiblePending] = useState<NodeJS.Timeout>(null);
  const [visibleAbout, setVisibleAbout] = useState(false);

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

  useEffect(() => {
    if (side === "browser") {
      if (Boolean(localStorage.getItem("visible-about")) === false) {
        setVisibleAbout(true);
      }
    }
  }, [side]);

  return (
    <Page>
      {visibleAbout && <PageColumn className="home__about">
        <div>
          <span><b>Once QR</b> is a service that allows you to create a one-time QR code.
          Just paste the link into the input field, click the "create" button and save the QR code or copy the link to it.
          </span>
          <a href="#" onClick={() => {
            setVisibleAbout(false);
            localStorage.setItem("visible-about", "true");
          }}>hide</a>
        </div>
      </PageColumn>}
      <PageColumn>
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
        <Button
          loading={visiblePending}
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
          Create
        </Button>
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
      </PageColumn>
    </Page>
  );
};

function useIsSide() {
  try {
    if (window) {
      return "browser";
    }
  } catch(error) {
    return "server";
  }
}
