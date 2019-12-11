import * as React from "react";
import AddButton from "./components/AddButton";
import "typeface-roboto";
import UploadDialog from "./components/UploadDialog";

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
        <AddButton handleClick={this.openUploadDialog} />
        <UploadDialog open={this.state.uploadDialogOpened} handleClose={this.closeUploadDialog} />
      </React.Fragment>
    );
  }
}
