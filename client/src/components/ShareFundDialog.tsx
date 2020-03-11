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
  FormControl
} from "@material-ui/core";
import FileInput from "./FileInput";
import axios from "axios";
import { User } from "../LoginPage";
import Axios from "axios";

export interface ShareFundDialogProps {
  fundId: string;
  handleClose: Function;
}

export interface ShareFundDialogState {
  open: boolean;
  users: User[];
  selectedUser?: User;
}

export default class ShareFundDialog extends React.Component<ShareFundDialogProps, ShareFundDialogState> {
  state: ShareFundDialogState = { open: true, users: [] };

  componentDidMount() {
    this.getUsers().then((users: User[]) => {
      this.setState({ users });
    });
  }

  getUsers = async () => {
    return new Promise<User[]>((resolve, reject) => {
      Axios.get("/users")
        .then(response => resolve(response.data.users))
        .catch(function(error) {
          console.log(error);
          reject();
        });
    });
  };

  handleUserSelected = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ selectedUser: this.state.users[event.target.value as number] });
  };

  handleShare = () => {
    if (this.state.selectedUser) {
      this.shareFundWithUser(this.props.fundId, this.state.selectedUser).finally(() => {
        this.props.handleClose();
      });
    }
  };

  shareFundWithUser = async (fundId: string, user: User) => {
    return new Promise<User[]>((resolve, reject) => {
      Axios.post("/shareFund", { fundId, user })
        .then(response => resolve())
        .catch(function(error) {
          console.log(error);
          reject();
        });
    });
  };

  render() {
    return (
      <Dialog open fullWidth maxWidth="xs" onClose={() => this.props.handleClose()}>
        <DialogTitle>Share Fund</DialogTitle>
        <DialogContent>
          <FormControl style={{ minWidth: "120px" }}>
            <InputLabel>Share with</InputLabel>
            <Select value={this.state.selectedUser} onChange={this.handleUserSelected}>
              {this.state.users.map((user, index) => (
                <MenuItem value={index}>{user.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
