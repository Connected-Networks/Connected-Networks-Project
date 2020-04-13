import * as React from "react";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import styled from "styled-components";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";

const Title = styled.h1`
  margin-left: 10px;
`;

export interface TitleBarProps {
  toggleOpen: Function;
  handleUpload: Function;
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
          <Title style={{ flexGrow: 1 }}>Connected Networks</Title>
          <IconButton color="inherit" onClick={() => this.props.handleUpload()} style={{}}>
            <ImportIcon fill={"white"} />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TitleBar;
