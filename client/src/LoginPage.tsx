import * as React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import styled from "styled-components";
import { TextField, Button } from "@material-ui/core";

interface LoginPageProps {
  confirmAuth: Function;
}

export default function LoginPage(props: LoginPageProps) {
  const history = useHistory();
  return (
    <Container>
      <FormContainer>
        <TextField label="Email" variant="outlined" />
        <TextField label="Password" variant="outlined" />
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            props.confirmAuth();
            history.push("/");
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
