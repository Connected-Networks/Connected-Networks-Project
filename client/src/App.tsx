import * as React from "react";
import "typeface-roboto";
import UploadDialog from "./components/UploadDialog";
import PeopleTable from "./components/PeopleTable";
import SideMenu from "./components/SideMenu";
import TitleBar from "./components/TitleBar";
import styled from "styled-components";
import CompaniesTable from "./components/CompaniesTable";

export interface AppState {
  uploadDialogOpened: boolean;
  openSideMenu: boolean;
  tableType: TableType;
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

export enum TableType {
  RECENT,
  STARRED,
  PEOPLE,
  COMPANIES
}

export default class App extends React.Component<any, AppState> {
  state = {
    uploadDialogOpened: false,
    openSideMenu: false,
    tableType: TableType.PEOPLE
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

  switchTables = (tableType: TableType) => {
    this.setState({ tableType });
  };

  getTable = (tableType: TableType) => {
    switch (tableType) {
      case TableType.PEOPLE:
        return <PeopleTable uploadHandler={this.openUploadDialog} />;

      case TableType.COMPANIES:
        return <CompaniesTable uploadHandler={this.openUploadDialog} />;

      default:
        break;
    }
  };

  render() {
    return (
      <Container>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
        <TitleBar toggleOpen={this.toggleSideMenu} />
        <Content>
          <SideMenu open={this.state.openSideMenu} handleSwitchTable={this.switchTables} />
          {this.getTable(this.state.tableType)}
        </Content>
        <UploadDialog open={this.state.uploadDialogOpened} handleClose={this.closeUploadDialog} />
      </Container>
    );
  }
}
