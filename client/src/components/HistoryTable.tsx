import EditableObject from "./EditableObject";
import axios from "axios";
import ATable from "./ATable";
import { DisplayPerson } from "./PeopleTable";
import CompaniesAutoComplete from "./CompaniesAutoComplete";
import React from "react";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

interface TableProps {
  person: DisplayPerson;
}

interface DisplayHistory {
  id: number;
  company: string;
  position: string;
  start: string;
  end: string;
}

export default class HistoryTable extends ATable<DisplayHistory, TableProps> {
  state = {
    data: [],
    columns: [
      {
        title: "Company",
        field: "company",
        editComponent: (tableData: any) => {
          if (tableData.rowData.id) {
            return tableData.rowData.company;
          }

          return (
            <CompaniesAutoComplete
              fundID={this.props.person.fundID}
              handleSelectCompany={(selectedID: number, selectedCompany: string) => {
                tableData.rowData.company = selectedCompany;
              }}
            />
          );
        },
      },
      { title: "Current Position", field: "position" },
      {
        title: "Start date",
        field: "start",
        editComponent: (tableData: any) => {
          let currentDate;
          if (tableData.rowData && tableData.rowData.start) {
            currentDate = tableData.rowData.start;
          } else {
            currentDate = new Date();
          }

          return this.getDatePicker(currentDate, (newDate: Date, value: any) => {
            console.log(value);
            tableData.rowData.start = newDate.toString();
          });
        },
      },
      {
        title: "End date",
        field: "end",
        editComponent: (tableData: any) => {
          let currentDate;
          if (tableData.rowData && tableData.rowData.end) {
            currentDate = tableData.rowData.end;
          } else {
            currentDate = new Date();
          }

          return this.getDatePicker(currentDate, (newDate: Date, value: any) => {
            console.log(value);
            tableData.rowData.end = newDate.toString();
          });
        },
      },
    ],
  };

  get name(): string {
    return "Employment History";
  }

  get dataEndPoint(): string {
    return `/history/${this.props.person.id}`;
  }

  get editableObject(): EditableObject<DisplayHistory> {
    return {
      onRowUpdate: this.updateRow,
      onRowDelete: this.deleteRow,
      onRowAdd: this.addRow,
    };
  }

  getDatePicker = (selectedDate: Date, handleDateChange: any) => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy-MM-dd"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  updateRow = async (newData: DisplayHistory, oldData?: DisplayHistory | undefined): Promise<void> => {
    if (oldData) {
      try {
        await axios.put("/history", { newData, employee: this.props.person });
      } catch (error) {
        console.log(error);
      }
      this.refreshTable();
    }
  };

  addRow = async (newData: DisplayHistory): Promise<void> => {
    if (newData) {
      try {
        await axios.post(`/history`, { newData, employee: this.props.person });
      } catch (error) {
        console.log(error);
      }
      this.refreshTable();
    }
  };

  deleteRow = async (oldData: DisplayHistory): Promise<void> => {
    try {
      const historyID = oldData.id;
      await axios.delete(`/history/${historyID}`, { data: { employee: this.props.person } });
    } catch (error) {
      console.log(error);
    }
    this.refreshTable();
  };
}
