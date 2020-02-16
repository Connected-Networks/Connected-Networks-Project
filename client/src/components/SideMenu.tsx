import * as React from "react";
import { Divider, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

export interface SideMenuProps {
  open: boolean;
  tableTypes: string[];
  handleSwitchTable: Function;
}

export interface SideMenuState {
  funds: SideMenuFund[];
  addMode: boolean;
  newFundName: string;
}

interface SideMenuFund {
  id: number;
  name: string;
}

export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {
  state: SideMenuState = { funds: [], addMode: false, newFundName: "" };

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

  getAddFundComponent = () => {
    if (!this.state.addMode) {
      return null;
    }

    return (
      <ListItem>
        <TextField
          inputProps={{ onBlur: () => this.stopAddMode() }}
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
            this.stopAddMode();
          }}
        >
          <CheckIcon />
        </IconButton>
        <IconButton edge="end">
          <CloseIcon />
        </IconButton>
      </ListItem>
    );
  };

  stopAddMode = () => {
    this.setState({ addMode: false, newFundName: "" });
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

  getSideMenuWidth = () => {
    return this.state.addMode ? "250px" : "150px";
  };

  render() {
    return (
      <Container open={this.props.open} width={this.getSideMenuWidth()}>
        <List>
          {this.props.tableTypes.map(type => (
            <ListItem button key={type} onClick={() => this.props.handleSwitchTable(type)}>
              <ListItemText primary={type} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key={"Funds"}>
            <ListItemText primary={"Funds"} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => this.setState({ addMode: !this.state.addMode })}>
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
          {this.getAddFundComponent()}
        </List>
      </Container>
    );
  }
}

const Container = styled.div<{ open: boolean; width: string }>`
  /* max-height: 100%; */
  min-width: ${props => props.width};
  max-width: ${props => props.width};
  transition: margin 0.5s, min-width 0.5s, max-width 0.5s;
  margin-left: ${props => (props.open ? "0px" : "-" + props.width)};
  display: flex;
  flex-direction: column;
`;
