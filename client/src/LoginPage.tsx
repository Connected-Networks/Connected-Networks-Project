import * as React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import styled from "styled-components";
import Alert from "@material-ui/lab/Alert";
import { TextField, Button, Snackbar } from "@material-ui/core";
import Axios from "axios";

interface LoginPageProps {
  confirmAuth: Function;
}

export default function LoginPage(props: LoginPageProps) {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    credentialsValid(email, password).then(() => {
      goToMainPage();
    });
  };

  const credentialsValid = async (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      Axios.post(`/login`, { email, password })
        .then(() => resolve())
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

  const goToMainPage = () => {
    props.confirmAuth();
    history.push("/");
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
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
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
