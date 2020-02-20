import * as React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";

interface LoginPageProps {
  confirmAuth: Function;
}

export default function LoginPage(props: LoginPageProps) {
  const history = useHistory();
  return (
    <button
      onClick={() => {
        props.confirmAuth();
        history.push("/");
      }}
    >
      Authenticate
    </button>
  );
}
