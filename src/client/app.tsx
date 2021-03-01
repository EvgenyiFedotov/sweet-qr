import * as React from 'react';
import { Route, Switch } from "react-router-dom";

import { Page } from "./ui/templates/page";
import { PageHome } from "./pages/home";

export const App: React.FC = () => {
  return (
      <Switch>
        <Route path="*">
          <Page>
            <PageHome />
          </Page>
        </Route>
      </Switch>
  );
};