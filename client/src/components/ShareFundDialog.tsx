import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import Axios from "axios";
import UsersAutoComplete, { UserOptionType } from "./UsersAutoComplete";
import SharedWithDialog from "./SharedWithDialog";
import styled from "styled-components";

export interface ShareFundDialogProps {
  fundId: string;
  handleClose: Function;
}

export interface ShareFundDialogState {
  open: boolean;
  selectedUser?: UserOptionType;
  openSharedWith: boolean;
}

export default class ShareFundDialog extends React.Component<ShareFundDialogProps, ShareFundDialogState> {
  state: ShareFundDialogState = { open: true, openSharedWith: false };

  handleShare = async () => {
    if (this.state.selectedUser) {
      await Axios.post("/shareFund", { fundId: this.props.fundId, user: this.state.selectedUser });
      this.props.handleClose();
    }
  };

  openSharedWith = () => {
    this.setState({ open: false, openSharedWith: true });
  };

  handleClose = () => {
    this.setState({ open: true, openSharedWith: false });
  };

  render() {
    return (
      <>
        <Dialog open={this.state.open} fullWidth maxWidth="xs" onClose={() => this.props.handleClose()}>
          <DialogTitle>Share Fund</DialogTitle>
          <DialogContent>
            <UsersAutoComplete handleSelectUser={(selectedUser: UserOptionType) => this.setState({ selectedUser })} />
            <P onClick={this.openSharedWith}>Shared with...</P>
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
        <SharedWithDialog open={this.state.openSharedWith} fundId={this.props.fundId} handleClose={this.handleClose} />
      </>
    );
  }
}

const P = styled.p`
  font-size: 13px;
  color: grey;
  text-decoration: underline;
  cursor: pointer;
`;
