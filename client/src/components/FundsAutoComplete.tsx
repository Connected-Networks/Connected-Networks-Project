import * as React from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

export interface FundsAutoCompleteProps {
  handleSelectFund: Function;
}

export interface FundsAutoCompleteState {
  value: FundOptionType | null;
  openDialog: boolean;
  dialogValue: FundOptionType;
  funds: FundOptionType[];
}

interface FundOptionType {
  inputValue?: string;
  name: string;
  id?: number;
}

export default class FundsAutoComplete extends React.Component<FundsAutoCompleteProps, FundsAutoCompleteState> {
  filter = createFilterOptions<FundOptionType>();

  state: FundsAutoCompleteState = {
    value: null,
    openDialog: false,
    dialogValue: { name: "" },
    funds: [],
  };

  componentDidMount() {
    this.loadFunds();
  }

  loadFunds = async () => {
    try {
      const response = await Axios.get("/funds");
      this.setState({ funds: response.data.data });
    } catch (error) {
      console.error(error);
    }
  };

  toggleOpen = (open: boolean) => {
    this.setState({ openDialog: open });
  };

  setDialogValue = (fund: FundOptionType) => {
    this.setState({ value: fund });
  };

  openDialog = (newValue: string) => {
    // timeout to avoid instant validation of the dialog's form.
    setTimeout(() => {
      this.setState({ openDialog: true, dialogValue: { name: newValue } });
    });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.addNewFundToServer();
  };

  addNewFundToServer = async () => {
    try {
      const response = await Axios.post("/funds", { newData: this.state.dialogValue.name });
      this.loadFunds();
      this.handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  handleClose = () => {
    this.setState({ dialogValue: { name: "" }, openDialog: false });
  };

  render() {
    return (
      <>
        <Autocomplete
          value={this.state.value}
          onChange={(event: any, newValue: FundOptionType | null) => {
            if (typeof newValue === "string") {
              this.openDialog(newValue);
              return;
            }

            if (newValue && newValue.inputValue) {
              this.openDialog(newValue.inputValue);
              return;
            }

            this.setState({ value: newValue });
            if (newValue) {
              this.props.handleSelectFund(newValue.id);
            } else {
              this.props.handleSelectFund(undefined);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = this.filter(options, params) as FundOptionType[];

            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          options={this.state.funds}
          getOptionLabel={(option) => {
            // e.g value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.name;
          }}
          renderOption={(option) => option.name}
          style={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Fund" variant="outlined" style={{ width: "90%" }} />}
        />
        <Dialog open={this.state.openDialog} onClose={this.handleClose}>
          <form onSubmit={this.handleSubmit}>
            <DialogTitle>Add a new Fund</DialogTitle>
            <DialogContent>
              <DialogContentText>Please type in the name of the fund to add</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                value={this.state.dialogValue.name}
                onChange={(event) => this.setState({ dialogValue: { ...this.state.dialogValue, name: event.target.value } })}
                label="New Fund Name"
                type="text"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }
}
