import * as React from "react";
import "typeface-roboto";
import UploadDialog from "./components/UploadDialog";
import PeopleTable from "./components/PeopleTable";

export interface AppState {
  uploadDialogOpened: boolean;
}

export default class App extends React.Component<any, AppState> {
  state = {
    uploadDialogOpened: false
  };
  closeUploadDialog = () => {
    this.setState({ uploadDialogOpened: false });
  };
  openUploadDialog = () => {
    this.setState({ uploadDialogOpened: true });
  };

  render() {
    return (
      <React.Fragment>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
        <PeopleTable uploadHandler={this.openUploadDialog} />
        <UploadDialog open={this.state.uploadDialogOpened} handleClose={this.closeUploadDialog} />
      </React.Fragment>
    );
  }
}
