import * as React from 'react';
import { Route, Switch } from "react-router-dom";

import { Page } from "./ui/templates/page";
import { PageHome } from "./pages/home";
import { Page404 } from "./pages/404";

export const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/404">
        <Page404 />
      </Route>
      <Route path="*">
        <PageHome />
      </Route>
    </Switch>
  );
};