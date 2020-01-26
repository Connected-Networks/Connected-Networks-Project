import * as React from "react";
import "typeface-roboto";
import UploadDialog from "./components/UploadDialog";
import PeopleTable from "./components/PeopleTable";
import SideMenu from "./components/SideMenu";
import TitleBar from "./components/TitleBar";
import styled from "styled-components";

export interface AppState {
  uploadDialogOpened: boolean;
  openSideMenu: boolean;
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  height: 0%;
`;

export default class App extends React.Component<any, AppState> {
  state = {
    uploadDialogOpened: false,
    openSideMenu: false
  };
  closeUploadDialog = () => {
    this.setState({ uploadDialogOpened: false });
  };
  openUploadDialog = () => {
    this.setState({ uploadDialogOpened: true });
  };

  toggleSideMenu = () => {
    this.setState({ openSideMenu: !this.state.openSideMenu });
  };

  render() {
    return (
      <Container>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
        <TitleBar toggleOpen={this.toggleSideMenu} />
        <Content>
          <SideMenu open={this.state.openSideMenu} />
          <PeopleTable uploadHandler={this.openUploadDialog} />
        </Content>
        <UploadDialog open={this.state.uploadDialogOpened} handleClose={this.closeUploadDialog} />
      </Container>
    );
  }
}
