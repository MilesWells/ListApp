import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { Lists } from "../views";

export const Entrypoint: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Lists} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};
