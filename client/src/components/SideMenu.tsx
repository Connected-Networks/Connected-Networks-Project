import * as React from "react";
import { Divider, List, ListItem, ListItemText } from "@material-ui/core";
import styled from "styled-components";

export interface SideMenuProps {
  open: boolean;
}

export interface SideMenuState {}

const Container = styled.div<{ open: boolean }>`
  /* max-height: 100%; */
  min-width: 150px;
  max-width: 150px;
  transition: margin 0.5s;
  margin-left: ${props => (props.open ? "0px" : "-150px")};
  display: flex;
  flex-direction: column;
`;

export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {
  render() {
    return (
      <Container open={this.props.open}>
        <List>
          {["Recent", "Starred", "People", "Companies"].map(text => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key={"Funds"}>
            <ListItemText primary={"Funds"} />
          </ListItem>
        </List>
        <Divider />
      </Container>
    );
  }
}
