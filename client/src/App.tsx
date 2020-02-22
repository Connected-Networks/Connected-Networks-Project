import * as React from "react";
import "typeface-roboto";
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage, { User } from "./LoginPage";

interface AppState {
  isAuthenticated: boolean;
  user?: User;
}

export default class App extends React.Component<any, AppState> {
  state: AppState = { isAuthenticated: false };

  handleLogin = (user: User) => {
    this.setState({ isAuthenticated: true, user });
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage handleLogin={this.handleLogin} />
          </Route>
          <Route path="/">{this.state.isAuthenticated ? <MainPage user={this.state.user!} /> : <Redirect to="/login" />}</Route>
        </Switch>
      </Router>
    );
  }
}
