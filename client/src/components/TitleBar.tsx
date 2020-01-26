import * as React from "react";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import styled from "styled-components";

const Title = styled.h1`
  margin-left: 10px;
`;

export interface TitleBarProps {
  toggleOpen: Function;
}

export interface TitleBarState {}

class TitleBar extends React.Component<TitleBarProps, TitleBarState> {
  render() {
    return (
      <AppBar position={"relative"}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => this.props.toggleOpen()} edge="start">
            <MenuIcon />
          </IconButton>
          <Title>Connected Networks</Title>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TitleBar;
