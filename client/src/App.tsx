import * as React from "react";
import "typeface-roboto";
import UploadDialog from "./components/UploadDialog";
import SideMenu from "./components/SideMenu";
import TitleBar from "./components/TitleBar";
import styled from "styled-components";
import TablesFactory from "./components/TablesFactory";


export interface SideMenuFund {
  id: number;
  name: string;
}

export interface AppState {
  uploadDialogOpened: boolean;
  openSideMenu: boolean;
  tableType: string;
}

export default class App extends React.Component<any, AppState> {
  tablesFactory: TablesFactory;

  constructor(props: any) {
    super(props);
    this.tablesFactory = new TablesFactory(this.openUploadDialog);

    this.state = {
      uploadDialogOpened: false,
      openSideMenu: false,
      tableType: this.tablesFactory.getDefaultTableType()
    };
  }

  closeUploadDialog = () => {
    this.setState({ uploadDialogOpened: false });
  };
  openUploadDialog = () => {
    this.setState({ uploadDialogOpened: true });
  };

  toggleSideMenu = () => {
    this.setState({ openSideMenu: !this.state.openSideMenu });
  };

  switchTables = (tableType: string) => {
    this.setState({ tableType });
  };

  render() {
    return (
      <Container>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
        <TitleBar toggleOpen={this.toggleSideMenu} />
        <Content>
          <SideMenu
            open={this.state.openSideMenu}
            tableTypes={this.tablesFactory.getAvailableTables()}
            handleSwitchTable={this.switchTables}
          />
          {this.tablesFactory.getTableComponent(this.state.tableType)}
        </Content>
        <UploadDialog open={this.state.uploadDialogOpened} handleClose={this.closeUploadDialog} />
      </Container>
    );
  }
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
