import * as React from "react";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { ListItem, TextField, IconButton, List, ListItemText, ListItemSecondaryAction, Divider } from "@material-ui/core";

interface SideMenuFund {
  id: number;
  name: string;
}

export interface FundsMenuProps {
  handleSwitchTable: Function;
  handleEditMode: Function;
}

export interface FundsMenuState {
  funds: SideMenuFund[];
  editMode: boolean;
  newFundName: string;
}

export default class FundsMenu extends React.Component<FundsMenuProps, FundsMenuState> {
  state: FundsMenuState = { funds: [], editMode: false, newFundName: "" };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.getFunds().then(funds => this.setState({ funds }));
  };

  getFunds = async () => {
    return new Promise<SideMenuFund[]>(resolve => {
      axios
        .get("/funds")
        .then(response => resolve(response.data.data))
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  switchEditMode = (isEditMode: boolean) => {
    this.props.handleEditMode(isEditMode);
    this.setState({ editMode: isEditMode, newFundName: "" });
  };

  addFund = (fundName: string) => {
    axios
      .post("/funds", { fundName })
      .then(response => {
        this.refresh();
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <>
        <List>
          <ListItem key={"Funds"}>
            <ListItemText primary={"Funds"} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => this.switchEditMode(true)}>
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Divider />
        <List>
          {this.state.funds.map(fund => (
            <ListItem button key={fund.id} onClick={() => this.props.handleSwitchTable(fund.id.toString)}>
              <ListItemText primary={fund.name} />
            </ListItem>
          ))}

          {!this.state.editMode ? null : (
            <ListItem>
              <TextField
                inputProps={{ onBlur: () => this.switchEditMode(false) }}
                label="Fund Name"
                placeholder="New Fund"
                autoFocus
                onChange={event => this.setState({ newFundName: event.target.value })}
              />
              <IconButton
                edge="end"
                onMouseDown={event => event.preventDefault()}
                onClick={() => {
                  this.addFund(this.state.newFundName);
                  this.switchEditMode(false);
                }}
              >
                <CheckIcon />
              </IconButton>
              <IconButton edge="end">
                <CloseIcon />
              </IconButton>
            </ListItem>
          )}
        </List>
      </>
    );
  }
}
