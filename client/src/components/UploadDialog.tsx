import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import styled from "styled-components";

export interface UploadDialogProps {
  open: boolean;
  handleClose: Function;
}

class UploadDialog extends React.Component<UploadDialogProps, any> {
  render() {
    return (
      <Dialog fullWidth maxWidth="xs" onClose={() => this.props.handleClose()} open={this.props.open}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <DialogContentText>No file selected</DialogContentText>
          <Button onClick={() => this.props.handleClose()} color="primary">
            Select File
          </Button>
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

export default UploadDialog;
