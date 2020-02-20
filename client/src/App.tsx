import * as React from "react";
import "typeface-roboto";
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";

interface AppState {
  isAuthenticated: boolean;
}

export default class App extends React.Component<any, AppState> {
  state = { isAuthenticated: false };

  confirmAuth = () => {
    this.setState({ isAuthenticated: true });
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage confirmAuth={this.confirmAuth} />
          </Route>
          <Route path="/">{this.state.isAuthenticated ? <MainPage /> : <Redirect to="/login" />}</Route>
        </Switch>
      </Router>
    );
  }
}
