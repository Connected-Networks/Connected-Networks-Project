import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import Axios from "axios";
import UsersAutoComplete, { UserOptionType } from "./UsersAutoComplete";

export interface ShareFundDialogProps {
  fundId: string;
  handleClose: Function;
}

export interface ShareFundDialogState {
  open: boolean;
  selectedUser?: UserOptionType;
}

export default class ShareFundDialog extends React.Component<ShareFundDialogProps, ShareFundDialogState> {
  state: ShareFundDialogState = { open: true };

  handleShare = async () => {
    if (this.state.selectedUser) {
      await Axios.post("/shareFund", { fundId: this.props.fundId, user: this.state.selectedUser });
      this.props.handleClose();
    }
  };

  render() {
    return (
      <Dialog open fullWidth maxWidth="xs" onClose={() => this.props.handleClose()}>
        <DialogTitle>Share Fund</DialogTitle>
        <DialogContent>
          <UsersAutoComplete handleSelectUser={(selectedUser: UserOptionType) => this.setState({ selectedUser })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleClose()} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={() => this.handleShare()}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
