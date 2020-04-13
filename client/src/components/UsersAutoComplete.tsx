import * as React from "react";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

export interface UsersAutoCompleteProps {
  handleSelectUser: Function;
}

export interface UsersAutoCompleteState {
  value: UserOptionType | null;
  users: UserOptionType[];
}

export interface UserOptionType {
  inputValue?: string;
  name: string;
  id?: number;
}

export default class UsersAutoComplete extends React.Component<UsersAutoCompleteProps, UsersAutoCompleteState> {
  filter = createFilterOptions<UserOptionType>();

  state: UsersAutoCompleteState = {
    value: null,
    users: [],
  };

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = async () => {
    try {
      const response = await Axios.get("/users");
      this.setState({ users: response.data.users });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <>
        <Autocomplete
          value={this.state.value}
          onChange={(event: any, newValue: UserOptionType | null) => {
            this.setState({ value: newValue });
            this.props.handleSelectUser(newValue);
          }}
          filterOptions={(options, params) => this.filter(options, params) as UserOptionType[]}
          options={this.state.users}
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
          renderInput={(params) => <TextField {...params} label="User" variant="outlined" style={{ width: "90%" }} />}
        />
      </>
    );
  }
}
