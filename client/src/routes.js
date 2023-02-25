import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

const Routes = (props) => {
  return (
    <>
      <Switch>
        <Route exact path="/" render={<Home />} />
      </Switch>
    </>
  );
};

export default withRouter(Routes);
