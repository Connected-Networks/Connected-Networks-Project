import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import React from "react";
import moment from "moment";

interface HistoryDatePickerProps {
  handleDateChange: any;
  initialDate?: string;
  label?: string;
}

interface HistoryDatePickerState {
  selectedDate: Date | null;
}

export default class HistoryDatePicker extends React.Component<HistoryDatePickerProps, HistoryDatePickerState> {
  readonly DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

  state: HistoryDatePickerState = {
    selectedDate: this.props.initialDate ? new Date(this.props.initialDate) : null,
  };

  handleChangeSuper = (date: Date | null) => {
    if (date) {
      this.setState({ selectedDate: date });
      this.props.handleDateChange(moment(date).format("YYYY-MM-DD"));
    }
  };

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          disableToolbar
          variant="inline"
          format={this.DEFAULT_DATE_FORMAT}
          margin="normal"
          value={this.state.selectedDate}
          onChange={this.handleChangeSuper}
        />
      </MuiPickersUtilsProvider>
    );
  }
}
