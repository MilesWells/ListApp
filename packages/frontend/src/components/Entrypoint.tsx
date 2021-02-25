import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { EditList, Lists, NewList } from "../views";

export const Entrypoint: React.FC = () => {
  return (
    <Container fluid>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Lists} />
          <Route exact path="/lists/new" component={NewList} />
          <Route path="/lists/:id" component={EditList} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </Container>
  );
};
