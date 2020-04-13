import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import React from "react";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

interface DatePickerProps {
  handleDateChange: any;
  initialDate?: string;
  label?: string;
}

interface DatePickerState {
  selectedDate: string;
}

export default class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
  readonly DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

  state: DatePickerState = {
    selectedDate: this.props.initialDate ? this.props.initialDate : new Date().toISOString().slice(0, 10),
  };

  handleChangeSuper = (date: MaterialUiPickersDate, value?: string | null) => {
    if (value) {
      this.setState({ selectedDate: value });
      this.props.handleDateChange(date, this.state.selectedDate);
    }
  };

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format={this.DEFAULT_DATE_FORMAT}
          margin="normal"
          label={this.props.label}
          value={this.state.selectedDate}
          onChange={this.handleChangeSuper}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }
}
