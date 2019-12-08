import * as React from "react";
import styled from "styled-components";
import { ReactComponent as AddIcon } from "./resources/add-24px.svg";
import Button from "@material-ui/core/Button";

const StyledButton = styled(Button)({
  height: 50,
  width: 50
});

export default class AddButton extends React.Component {
  render() {
    return (
      <StyledButton>
        <AddIcon fill="grey" height="75%" width="75%" />
      </StyledButton>
    );
  }
}
