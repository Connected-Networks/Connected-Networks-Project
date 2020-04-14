import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import AccountIcon from "@material-ui/icons/Person";
import { User } from "../LoginPage";
import Axios from "axios";

export interface SharedWithDialogProps {
  open: boolean;
  fundId: number;
  handleClose: Function;
}

export interface SharedWithDialogState {
  users: User[];
}

export default class SharedWithDialog extends React.Component<SharedWithDialogProps, SharedWithDialogState> {
  state: SharedWithDialogState = { users: [] };

  componentDidMount() {
    Axios.get(`/shareFund/${this.props.fundId}`)
      .then((response) => {
        this.setState({ users: response.data.users });
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <Dialog open={this.props.open} fullWidth maxWidth="xs" onClose={() => this.props.handleClose()}>
        <DialogTitle>Shared With</DialogTitle>
        <DialogContent>
          <List>
            {this.state.users.length > 0 ? (
              this.state.users.map((user) => (
                <ListItem>
                  <ListItemAvatar>
                    <AccountIcon />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                </ListItem>
              ))
            ) : (
              <p>This fund is currently not shared with anyone</p>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.handleClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
