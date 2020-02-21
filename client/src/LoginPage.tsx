import * as React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import styled from "styled-components";
import { TextField, Button } from "@material-ui/core";
import Axios from "axios";

interface LoginPageProps {
  confirmAuth: Function;
}

export default function LoginPage(props: LoginPageProps) {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const credentialsValid = (email: string, password: string) => {
    if (email === "user" && password === "pass") {
      return true;
    }
    return false;
  };

  const goToMainPage = () => {
    props.confirmAuth();
    history.push("/");
  };

  return (
    <Container>
      <FormContainer>
        <TextField type="text" label="Email" variant="outlined" value={email} onChange={event => setEmail(event.target.value)} />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            if (credentialsValid(email, password)) {
              goToMainPage();
            }
          }}
        >
          Connect
        </Button>
      </FormContainer>
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
