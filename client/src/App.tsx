import * as React from "react";
import "typeface-roboto";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage, { User } from "./LoginPage";
import Axios from "axios";
import { createBrowserHistory } from "history";

interface AppState {
  isAuthenticated: boolean;
  user?: User;
}

export default class App extends React.Component<any, AppState> {
  state: AppState = { isAuthenticated: false };
  history = createBrowserHistory();

  componentDidMount() {
    this.checkIfLoggedIn().then((user: User) => {
      console.log("login");

      this.handleLogin(user);
    });
  }

  checkIfLoggedIn = () => {
    return new Promise<User>((resolve, reject) => {
      console.log("sent");

      Axios.get(`/user`)
        .then(response => {
          console.log("res");
          console.log(response.data);
          resolve(response.data);
        })
        .catch(error => {
          console.log("catch");

          console.log(error);

          reject();
        });
    });
  };

  handleLogin = (user: User) => {
    this.setState({ isAuthenticated: true, user });
    this.history.push("/");
  };

  render() {
    return (
      <Router history={this.history}>
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
