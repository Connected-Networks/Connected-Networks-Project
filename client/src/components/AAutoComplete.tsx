/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";

export interface AutoCompleteProps<OptionType> {
  componentID?: string;
}

interface AutoCompleteState<OptionType> {
  value: OptionType;
  open: boolean;
  dialogValue: OptionType;
  options: OptionType[];
}

export interface AOptionType {
  inputValue: string;
  title: any;
}

export default abstract class AAutoComplete<OptionType extends AOptionType> extends React.Component<
  AutoCompleteProps<OptionType>,
  AutoCompleteState<OptionType>
> {
  filter = createFilterOptions<OptionType>();

  abstract filterOptions(options: OptionType[], params: FilterOptionsState): OptionType[];
  abstract handleClose(): void;
  abstract setValue(inputtedValues: OptionType): void;
  abstract setDialogValue(newValue: string): void;

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setValue(this.state.dialogValue);
    this.handleClose();
  };

  toggleOpen = (toSet: boolean) => {
    this.setState({ open: toSet });
  };

  render() {
    return null;
    // return (
    //   <>
    //     <Autocomplete
    //       value={this.state.value}
    //       onChange={(event: any, newValue: OptionType | null) => {
    //         if (!newValue) {
    //           return;
    //         }

    //         if (typeof newValue === "string") {
    //           // timeout to avoid instant validation of the dialog's form.
    //           setTimeout(() => {
    //             this.toggleOpen(true);
    //             this.setDialogValue(newValue);
    //           });
    //           return;
    //         }

    //         if (newValue && newValue.inputValue) {
    //           this.toggleOpen(true);
    //           this.setDialogValue(newValue.inputValue);
    //           return;
    //         }

    //         this.setValue(newValue);
    //       }}
    //       filterOptions={this.filterOptions}
    //       id={this.props.componentID ? this.props.componentID : "auto-complete-default"}
    //       options={this.state.options}
    //       getOptionLabel={(option) => {
    //         // e.g value selected with enter, right from the input
    //         if (typeof option === "string") {
    //           return option;
    //         }
    //         if (option.inputValue) {
    //           return option.inputValue;
    //         }
    //         return option.title;
    //       }}
    //       renderOption={(option) => option.title}
    //       style={{ width: 300 }}
    //       renderInput={(params) => <TextField {...params} label="Free solo dialog" variant="outlined" />}
    //     />
    //     <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
    //       <form onSubmit={this.handleSubmit}>
    //         <DialogTitle id="form-dialog-title">Add a new film</DialogTitle>
    //         <DialogContent>
    //           <DialogContentText>Did you miss any film in our list? Please, add it!</DialogContentText>
    //           <TextField
    //             autoFocus
    //             margin="dense"
    //             id="name"
    //             value={this.state.dialogValue.title}
    //             onChange={(event) => this.setDialogValue({ ...this.state.dialogValue, title: event.target.value })}
    //             label="title"
    //             type="text"
    //           />
    //           <TextField
    //             margin="dense"
    //             id="name"
    //             value={dialogValue.year}
    //             onChange={(event) => setDialogValue({ ...dialogValue, year: event.target.value })}
    //             label="year"
    //             type="number"
    //           />
    //         </DialogContent>
    //         <DialogActions>
    //           <Button onClick={handleClose} color="primary">
    //             Cancel
    //           </Button>
    //           <Button type="submit" color="primary">
    //             Add
    //           </Button>
    //         </DialogActions>
    //       </form>
    //     </Dialog>
    //   </>
    // );
  }
}
