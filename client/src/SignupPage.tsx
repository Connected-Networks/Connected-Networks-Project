import * as React from "react";
import { RouteComponentProps, useHistory, Link } from "react-router-dom";
import styled from "styled-components";
import Alert from "@material-ui/lab/Alert";
import { TextField, Button, Snackbar } from "@material-ui/core";
import Axios from "axios";

export interface User {
  username: string;
}

interface SignupPageProps {
  goToMainPage: Function;
}

export default function SignupPage(props: SignupPageProps) {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signup(email, username, password).then(() => {
      login(username, password).then((user: User) => {
        props.goToMainPage(user);
      });
    });
  };

  const signup = async (email: string, username: string, password: string) => {
    return new Promise((resolve, reject) => {
      Axios.post(`/signup`, { email, username, password })
        .then(() => resolve())
        .catch(error => {
          console.log(error);
          if (error.response.status === 409) {
            notifyUser(
              "Email and/or username is already used for another account. Please login or use a different email and/or username"
            );
          } else {
            notifyUser("Something went wrong with the server. Please try again later");
          }
          reject();
        });
    });
  };

  const login = async (username: string, password: string) => {
    return new Promise<User>((resolve, reject) => {
      Axios.post(`/login`, { username, password })
        .then(response => resolve(response.data))
        .catch(() => reject());
    });
  };

  const notifyUser = (message: string) => {
    setAlertMessage(message);
    setOpen(true);
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <FormContainer>
          <TextField
            type="text"
            label="Email"
            variant="outlined"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <TextField
            type="text"
            label="Username"
            variant="outlined"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <Button type="submit" variant="outlined" color="primary">
            Sign Up
          </Button>
        </FormContainer>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert variant="filled" onClose={() => setOpen(false)} severity="error">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const P = styled.p`
  font-size: 13px;
  margin-top: 0px;
  margin-bottom: 2px;
`;
