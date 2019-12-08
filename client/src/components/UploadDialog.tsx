import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import FileInput from "./FileInput";

export interface UploadDialogProps {
  open: boolean;
  handleClose: Function;
}

export interface UploadDialogState {
  selectedFile: File | null;
}

export default class UploadDialog extends React.Component<UploadDialogProps, UploadDialogState> {
  state: UploadDialogState = {
    selectedFile: null
  };
  handleFileSelected = (selectedFile: File) => {
    this.setState({ selectedFile: selectedFile });
  };

  render() {
    return (
      <Dialog fullWidth maxWidth="xs" onClose={() => this.props.handleClose()} open={this.props.open}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.state.selectedFile ? this.state.selectedFile.name : "No file selected"}</DialogContentText>
          <FileInput handleFileSelected={this.handleFileSelected} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleClose()} color="primary">
            Cancel
          </Button>
          <Button color="primary">Upload</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
