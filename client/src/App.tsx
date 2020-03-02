import * as React from "react";
import "typeface-roboto";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage, { User } from "./LoginPage";
import Axios from "axios";
import { createBrowserHistory } from "history";
import SignupPage from "./SignupPage";

interface AppState {
  isAuthenticated: boolean;
  user?: User;
}

export default class App extends React.Component<any, AppState> {
  state: AppState = { isAuthenticated: false };
  history = createBrowserHistory();

  componentDidMount() {
    this.checkIfLoggedIn().then((user: User) => {
      this.goToMainPage(user);
    });
  }

  checkIfLoggedIn = () => {
    return new Promise<User>((resolve, reject) => {
      Axios.get(`/user`)
        .then(response => resolve(response.data))
        .catch(() => reject());
    });
  };

  goToMainPage = (user: User) => {
    this.setState({ isAuthenticated: true, user });
    this.history.push("/");
  };

  render() {
    return (
      <Router history={this.history}>
        <Switch>
          <Route path="/login">
            <LoginPage goToMainPage={this.goToMainPage} />
          </Route>
          <Route path="/signup">
            <SignupPage goToMainPage={this.goToMainPage} />
          </Route>
          <Route path="/">{this.state.isAuthenticated ? <MainPage user={this.state.user!} /> : <Redirect to="/login" />}</Route>
        </Switch>
      </Router>
    );
  }
}
