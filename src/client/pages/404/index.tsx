import * as React from "react";
import { useHistory } from "react-router-dom";
import { Page } from "../../ui/templates/page";
import logo from "../home/images/logo.png";
import { Button } from "../../ui/atoms/button";
import { pageMain } from "../../../server/paths";
import "./index.css";

export const Page404: React.FC = () => {
  const history = useHistory();

  return (
    <Page>
      <div className="page-404__header">404</div>
      <img className="home__logo" alt="Logo" src={logo} />
      <Button onClick={() => {
        history.push(pageMain());
      }}>Back</Button>
    </Page>
  );
};
