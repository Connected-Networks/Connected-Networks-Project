import * as React from "react";
import { Divider, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import styled from "styled-components";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";

export interface SideMenuProps {
  open: boolean;
  tableTypes: string[];
  handleSwitchTable: Function;
}

export interface SideMenuState {
  funds: SideMenuFund[];
}

interface SideMenuFund {
  id: number;
  name: string;
}

export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {
  state: SideMenuState = { funds: [] };
  componentDidMount() {
    this.getFunds().then(funds => this.setState({ funds }));
  }

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

  render() {
    return (
      <Container open={this.props.open}>
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
              <IconButton edge="end" aria-label="Add">
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
        </List>
      </Container>
    );
  }
}

const Container = styled.div<{ open: boolean }>`
  /* max-height: 100%; */
  min-width: 150px;
  max-width: 150px;
  transition: margin 0.5s;
  margin-left: ${props => (props.open ? "0px" : "-150px")};
  display: flex;
  flex-direction: column;
`;
