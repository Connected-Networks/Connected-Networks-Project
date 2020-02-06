import React from "react";
import MaterialTable, { Column } from "material-table";
import axios from "axios";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import styled from "styled-components";
import ATable, { TableState, TableProps } from "./ATable";

const Container = styled.div`
  flex: 1;
`;

interface DisplayPerson {
  id: number;
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

// interface TableProps {
//   uploadHandler: Function;
// }

// interface TableState {
//   people: DisplayPerson[];
//   columns: Array<Column<DisplayPerson>>;
// }

const tableName = "People";

const getTableName = () => {
  return tableName;
}

export default class PeopleTable extends ATable<DisplayPerson> {

  get name(): String {
    return getTableName();
  }
  
  state: TableState<DisplayPerson> = {
    data: [],
    columns: [
      { title: "Name", field: "name" },
      { title: "Company", field: "company" },
      { title: "Position", field: "position" }
    ]
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

  // /**
  //  * This takes in the local data state on people and refreshes the table based on that.
  //  */
  // refreshTable() {
  //   this.state.people.forEach(person => {
  //     let r: Row = {
  //       name: person.name,
  //       companyAndPosition: !person.company && !person.position ? "" : person.company.concat(" | " + person.position)
  //     };
  //   });
  // }
  /**
   * This method takes two rows and updates the old row on the table with the new one
   *
   * @param newData
   * @param oldData
   */
  updateRow = async (newData: DisplayPerson, oldData?: DisplayPerson | undefined): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (oldData) {
          console.log(newData);
          this.updatePersonOnServer(newData).then(() => {
            this.refreshTable();
            resolve();
          });
        }
      }, 600);
    });
  };

  updatePersonOnServer = async (person: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/people", person)
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

  addRow = async (newData: DisplayPerson): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (newData) {
          console.log(newData);
          this.addPersonOnServer(newData).then(() => {
            resolve();
          });
        }
      }, 1000);
    });
  };

  addPersonOnServer = async (newData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`/people`, { newData })
        .then(response => {
          if (response.status === 200) {
            this.refreshTable();
            resolve();
          } else {
            this.refreshTable();
            reject();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  deleteRow = async (oldData: DisplayPerson): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.deletePersonOnServer(oldData)
          .then(() => {
            this.refreshTable();
            resolve();
          })
          .catch(() => {
            this.refreshTable();
            resolve();
          });
      }, 1000);
    });
  };

  deletePersonOnServer = async (oldData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      const personID = oldData.id; //Temp until we make ids for people
      axios
        .delete(`/people/${personID}`)
        .then(response => {
          console.log("status: " + response.status);
          resolve();
        })
        .catch(function(error) {
          console.log(error);
          reject();
        });
    });
  };

  /**
   * Once this loaded, this code will run.
   */
  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = () => {
    this.getPeople()
      .then(people => {
        this.setState({ data:people });
      })
      .catch(() => {});
  };

  render() {
    return (
      <Container>
        <MaterialTable
          columns={this.state.columns}
          data={this.state.data}
          editable={{
            onRowAdd: this.addRow,
            onRowUpdate: this.updateRow,
            onRowDelete: this.deleteRow
          }}
          title="People"
          actions={[
            {
              icon: () => <ImportIcon fill={"grey"} />,
              tooltip: "Upload CSV",
              isFreeAction: true,
              onClick: (event, rowData) => {
                this.props.uploadHandler();
                this.refreshTable();
              }
            }
          ]}
        />
      </Container>
    );
  }
}
