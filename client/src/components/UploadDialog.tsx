import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import FileInput from "./FileInput";
import axios from "axios";

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
  NO_FILE_SELECTED = (<i>No file selected</i>);

  handleFileSelected = (selectedFile: File) => {
    this.setState({ selectedFile: selectedFile });
  };

  handleClose = () => {
    this.props.handleClose();
    this.setState({ selectedFile: null });
  };

  handleUpload = () => {
    if (this.state.selectedFile) {
      try {
        this.readFile(this.state.selectedFile).then(fileData => {
          this.upload(fileData);
          this.handleClose();
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  async readFile(file: File): Promise<string> {
    let reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
      };

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.readAsText(file);
    });
  }

  upload = (fileData: string) => {
    axios
      .post("/csv", {
        data: fileData
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <Dialog fullWidth maxWidth="xs" onClose={() => this.handleClose()} open={this.props.open}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.state.selectedFile ? this.state.selectedFile.name : this.NO_FILE_SELECTED}</DialogContentText>
          <FileInput handleFileSelected={this.handleFileSelected} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={() => this.handleUpload()}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
