import * as React from "react";
import styled from "styled-components";
import { ReactComponent as AddIcon } from "./resources/add-24px.svg";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

export interface UploadDialogProps {
  handleClick: Function;
}

export interface UploadDialogState {
  open: boolean;
}

export default class AddButton extends React.Component<UploadDialogProps, UploadDialogState> {
  anchorRef: any;
  state = { open: false };
  handleToggle = () => {
    this.setState({ open: true });
  };
  manuallyAddPerson = () => {};
  CSVUpload = () => {
    this.props.handleClick();
  };
  render() {
    return (
      <React.Fragment>
        <ButtonGroup ref={element => (this.anchorRef = element)}>
          <Button onClick={() => this.manuallyAddPerson()}>
            <AddIcon />
          </Button>
          <Button size="small" onClick={() => this.handleToggle()}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={this.state.open} anchorEl={this.anchorRef} transition disablePortal>
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: "bottom-end"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={() => this.setState({ open: false })}>
                  <MenuList id="split-button-menu">
                    <MenuItem key={0} onClick={() => this.manuallyAddPerson()}>
                      Add Person
                    </MenuItem>
                    <MenuItem key={0} onClick={() => this.CSVUpload()}>
                      Import CSV
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </React.Fragment>
    );
  }
}
