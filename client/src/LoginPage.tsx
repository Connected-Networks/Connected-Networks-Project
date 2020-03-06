import * as React from "react";
import { RouteComponentProps, useHistory, Link } from "react-router-dom";
import styled from "styled-components";
import Alert from "@material-ui/lab/Alert";
import { TextField, Button, Snackbar } from "@material-ui/core";
import Axios from "axios";

export interface User {
  username: string;
}

interface LoginPageProps {
  goToMainPage: Function;
}

export default function LoginPage(props: LoginPageProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(username, password).then((user: User) => {
      console.log(JSON.stringify(user));

      props.goToMainPage(user);
    });
  };

  const login = async (username: string, password: string) => {
    return new Promise<User>((resolve, reject) => {
      Axios.post(`/login`, { username, password })
        .then(response => resolve(response.data))
        .catch(error => {
          console.log(error);
          if (error.response.status === 401) {
            notifyUser("Invalid email and/or password. Please try again");
          } else {
            notifyUser("Something went wrong with the server. Please try again later");
          }
          reject();
        });
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
          <div style={{ width: "100%" }}>
            <P>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </P>
          </div>
          <Button type="submit" variant="outlined" color="primary">
            Connect
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
  height: 30vh;
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
