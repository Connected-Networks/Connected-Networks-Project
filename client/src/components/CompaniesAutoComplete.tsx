import * as React from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

export interface CompaniesAutoCompleteProps {
  fundID: number;
}

export interface CompaniesAutoCompleteState {
  value: CompanyOptionType | null;
  openDialog: boolean;
  dialogValue: CompanyOptionType;
  companies: CompanyOptionType[];
}

interface CompanyOptionType {
  inputValue?: string;
  name: string;
  id?: number;
}

export default class CompaniesAutoComplete extends React.Component<CompaniesAutoCompleteProps, CompaniesAutoCompleteState> {
  filter = createFilterOptions<CompanyOptionType>();

  state: CompaniesAutoCompleteState = {
    value: null,
    openDialog: false,
    dialogValue: { name: "" },
    companies: [],
  };

  componentDidMount() {
    this.loadCompanies();
  }

  componentDidUpdate(prevProps: CompaniesAutoCompleteProps) {
    if (this.props.fundID !== prevProps.fundID) {
      this.loadCompanies();
    }
  }

  loadCompanies = async () => {
    try {
      const response = await Axios.get("/funds/" + this.props.fundID);
      this.setState({ companies: response.data.data, value: null });
    } catch (error) {
      console.error(error);
    }
  };

  toggleOpen = (open: boolean) => {
    this.setState({ openDialog: open });
  };

  setDialogValue = (fund: CompanyOptionType) => {
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
      this.loadCompanies();
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
          onChange={(event: any, newValue: CompanyOptionType | null) => {
            if (typeof newValue === "string") {
              this.openDialog(newValue);
              return;
            }

            if (newValue && newValue.inputValue) {
              this.openDialog(newValue.inputValue);
              return;
            }

            this.setState({ value: newValue });
          }}
          filterOptions={(options, params) => {
            const filtered = this.filter(options, params) as CompanyOptionType[];

            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                name: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          options={this.state.companies}
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
          renderInput={(params) => <TextField {...params} label="Company" variant="outlined" style={{ width: "90%" }} />}
        />
        <Dialog open={this.state.openDialog} onClose={this.handleClose}>
          <form onSubmit={this.handleSubmit}>
            <DialogTitle>Add a new Company</DialogTitle>
            <DialogContent>
              <DialogContentText>Please type in the name of the company to add</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                value={this.state.dialogValue.name}
                onChange={(event) => this.setState({ dialogValue: { ...this.state.dialogValue, name: event.target.value } })}
                label="New Company Name"
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
