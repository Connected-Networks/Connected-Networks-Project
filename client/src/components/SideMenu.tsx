import * as React from "react";
import { Divider, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField } from "@material-ui/core";
import styled from "styled-components";
import FundsMenu from "./FundsMenu";

export interface SideMenuProps {
  open: boolean;
  tableTypes: string[];
  handleSwitchTable: Function;
}

export interface SideMenuState {
  editMode: boolean;
}

export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {
  state = { editMode: false };

  handleEditMode = (editMode: boolean) => this.setState({ editMode });

  getSideMenuWidth = () => {
    return this.state.editMode ? "250px" : "150px";
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
        <FundsMenu handleSwitchTable={this.props.handleSwitchTable} handleEditMode={this.handleEditMode} />
      </Container>
    );
  }
}

const Container = styled.div<{ open: boolean; width: string }>`
  min-width: ${props => props.width};
  max-width: ${props => props.width};
  transition: margin 0.5s, min-width 0.5s, max-width 0.5s;
  margin-left: ${props => (props.open ? "0px" : "-" + props.width)};
  display: flex;
  flex-direction: column;
`;
