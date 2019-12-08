import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import styled from "styled-components";

const Input = styled.input`
  display: none;
`;

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
          <Input accept=".csv" id="uploadInput" type="file" onChange={event => this.handleFileSelected(event.target.files![0])} />
          <label htmlFor="uploadInput">
            <Button color="primary" component="span">
              Select File
            </Button>
          </label>
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
