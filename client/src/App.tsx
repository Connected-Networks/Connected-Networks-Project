import * as React from "react";
import AddButton from "./components/AddButton";
import "typeface-roboto";
import UploadDialog from "./components/UploadDialog";

export interface AppState {
  openUploadDialog: boolean;
}

export default class App extends React.Component<any, AppState> {
  state = {
    openUploadDialog: true
  };
  closeUploadDialog = () => {
    this.setState({ openUploadDialog: false });
  };
  render() {
    return (
      <React.Fragment>
        <AddButton />
        <UploadDialog open={this.state.openUploadDialog} handleClose={this.closeUploadDialog} />
      </React.Fragment>
    );
  }
}
