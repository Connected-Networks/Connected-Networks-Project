import React from "react";
import MaterialTable, { Column } from "material-table";
import axios from "axios";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import { rejects } from "assert";

interface Row {
  name: string;
  companyAndPosition: string;
}

interface TableState {
  columns: Array<Column<Row>>;
  data: Row[];
}

interface DisplayPerson {
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

interface TableProps {
  uploadHandler: Function;
}

interface TableState {
  people: DisplayPerson[];
  columns: Array<Column<Row>>;
  data: Row[];
}

export default class PeopleTable extends React.Component<TableProps, TableState> {
  state: TableState = {
    people: [],
    columns: [
      { title: "Name", field: "name" },
      { title: "Company", field: "companyAndPosition" }
    ],
    data: []
  };

  /**
   * This method sends an AJAX get request to get people
   */
  getPeople = async () => {
    return new Promise<DisplayPerson[]>(resolve => {
      axios
        .get("/people")
        .then(response => resolve(response.data.data))
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  /**
   * This takes in the local data state on people and refreshes the table based on that.
   */
  refreshTable() {
    // Clear data
    this.setState({ data: [] });

    this.state.people.forEach(person => {
      let r: Row = {
        name: person.name,
        companyAndPosition: person.company.concat(" | " + person.position)
      };
      this.addPersonToTable(r);
    });
  }
  /**
   * This method takes two rows and updates the old row on the table with the new one
   *
   * @param newData
   * @param oldData
   */
  updateRow = async (newData: Row, oldData?: Row | undefined): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (oldData) {
          this.updatePersonOnServer(newData, oldData).then(() => {
            this.setState(prevState => {
              const data = [...prevState.data];
              data[data.indexOf(oldData)] = newData;
              return { ...prevState, data };
            });
            resolve();
          });
        }
      }, 600);
    });
  };

  updatePersonOnServer = async (newData: Row, oldData?: Row | undefined) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/people", { newData, oldData })
        .then(response => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  addRow = async (newRow: Row): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (newRow) {
          this.addPersonOnServer(newRow).then(() => {
            this.addPersonToTable(newRow);
            resolve();
          });
        }
      }, 1000);
    });
  };

  addPersonToTable = (newRow: Row) => {
    const data = this.state.data.slice();
    data.push(newRow);
    this.setState({ data });
  };

  addPersonOnServer = async (newRow: Row) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`/people`, { newRow })
        .then(response => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  deleteRow = async (oldData: Row): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.deletePersonOnServer(oldData).then(() => {
          let data = this.state.data.slice();
          const index = data.indexOf(oldData);
          data.splice(index, 1);
          this.setState({ data }, () => resolve());
        });
      }, 1000);
    });
  };

  deletePersonOnServer = async (oldData: Row) => {
    return new Promise((resolve, reject) => {
      const randomID = 5; //Temp until we make ids for people
      axios
        .delete(`/people/${randomID}`)
        .then(response => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  /**
   * Once this loaded, this code will run.
   */
  componentDidMount() {
    this.getPeople()
      .then(people => {
        this.setState({ people });
        this.refreshTable();
      })
      .catch(() => {});
  }

  render() {
    return (
      <MaterialTable
        columns={this.state.columns}
        data={this.state.data}
        editable={{
          onRowAdd: this.addRow,
          onRowUpdate: this.updateRow,
          onRowDelete: this.deleteRow
        }}
        actions={[
          {
            icon: () => <ImportIcon fill={"grey"} />,
            tooltip: "Upload CSV",
            isFreeAction: true,
            onClick: (event, rowData) => this.props.uploadHandler()
          }
        ]}
      />
    );
  }
}
