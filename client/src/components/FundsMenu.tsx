import * as React from "react";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import OptionIcon from "@material-ui/icons/MoreVert";
import SharedIcon from "@material-ui/icons/People";

import {
  ListItem,
  TextField,
  IconButton,
  List,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Menu,
  MenuItem,
} from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import AlertDialog from "./AlertDialog";

interface SideMenuFund {
  id: number;
  name: string;
  shared: boolean;
  isEditable?: boolean;
}

export interface FundsMenuProps {
  handleSwitchTable: Function;
  handleEditMode: Function;
}

export interface FundsMenuState {
  funds: SideMenuFund[];
  addMode: boolean;
  editMode: boolean;
  newFundName: string;
  dialog?: JSX.Element;
  adding: boolean;
}

export default class FundsMenu extends React.Component<FundsMenuProps, FundsMenuState> {
  state: FundsMenuState = {
    funds: [],
    addMode: false,
    editMode: false,
    newFundName: "",
    adding: false,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.getFunds().then((funds) => {
      // console.log(funds)
      if (!Object.keys(funds).length) {
        funds = [];
      }
      this.setState({
        funds,
        addMode: false,
        editMode: false,
        newFundName: "",
        adding: false,
      });
    });
  };

  getFunds = async () => {
    return new Promise<SideMenuFund[]>((resolve) => {
      axios
        .get("/funds")
        .then((response) => {
          console.log(response);
          resolve(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  setModes = (isEditMode: boolean, isAddMode?: boolean) => {
    if (this.state.editMode !== isEditMode) {
      this.props.handleEditMode(isEditMode);
      if (isAddMode === undefined) {
        this.setState({ editMode: isEditMode, newFundName: "" });
      } else {
        this.setState({
          editMode: isEditMode,
          addMode: isAddMode,
          newFundName: "",
        });
      }
    }
  };

  getFundListItem = (fund: SideMenuFund) => (
    <ListItem button key={fund.id} onClick={() => this.props.handleSwitchTable(fund.id.toString(), fund.name)}>
      <ListItemText primary={fund.name} />
      <ListItemSecondaryAction>
        {fund.shared ? (
          <SharedIcon style={{ color: "grey" }} />
        ) : (
          <PopupState variant="popover">
            {(popupState) => (
              <>
                <IconButton edge="end" {...bindTrigger(popupState)}>
                  <OptionIcon />
                </IconButton>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem
                    onClick={() => {
                      fund.isEditable = true;
                      this.setModes(true);
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      this.showDeleteDialog(fund);
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          </PopupState>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );

  showDeleteDialog = (fund: SideMenuFund) => {
    this.setState({
      dialog: (
        <AlertDialog
          title={"Delete this fund?"}
          description={`This action is permanent. Are you sure you want to delete the fund ${fund.name}?`}
          agreeOptionText={"Delete"}
          handleAgreeOption={() => this.deleteFund(fund.id)}
          handleClose={() => {
            this.setState({ dialog: undefined });
          }}
        />
      ),
    });
  };

  deleteFund = (fundID: number) => {
    axios
      .delete(`/funds/${fundID}`)
      .then((response) => {
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getFundEditableItem = (fund: SideMenuFund) => {
    this.setModes(true);
    return (
      <ListItem key={fund.id}>
        <TextField
          inputProps={{
            onBlur: () => {
              fund.isEditable = false;
              this.setModes(false, false);
            },
          }}
          label="Fund Name"
          placeholder={fund.name}
          autoFocus
          onChange={(event) => this.setState({ newFundName: event.target.value })}
        />
        <IconButton
          edge="end"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            this.setState({ adding: true });
            this.applyNewName(this.state.newFundName, fund);
          }}
          disabled={this.state.adding}
        >
          <CheckIcon />
        </IconButton>
        <IconButton edge="end">
          <CloseIcon />
        </IconButton>
      </ListItem>
    );
  };

  applyNewName = (newFundName: string, fund: SideMenuFund) => {
    if (this.state.addMode) {
      this.addFund(newFundName);
    } else {
      this.editFund(this.state.newFundName, fund);
    }
  };

  addFund = (newData: string) => {
    axios
      .post("/funds", { newData })
      .then((response) => {
        this.refresh();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  editFund = (newFundName: string, fund: SideMenuFund) => {
    const newFund = { ...fund, name: newFundName };
    axios
      .put("/funds", { newData: newFund })
      .then((response) => {
        this.refresh();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  getNewEditableFund = () => {
    return { id: -1, name: "New Fund", isEditable: true, shared: false };
  };

  render() {
    return (
      <>
        <List>
          <ListItem key={"Funds"}>
            <ListItemText primary={"Funds"} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => this.setModes(true, true)}>
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        <Divider />
        <List>
          {this.state.funds.map((fund) => (fund.isEditable ? this.getFundEditableItem(fund) : this.getFundListItem(fund)))}
          {this.state.addMode ? this.getFundEditableItem(this.getNewEditableFund()) : null}
        </List>
        {this.state.dialog}
      </>
    );
  }
}
