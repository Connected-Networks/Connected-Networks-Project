import React from "react";
import { DisplayPerson } from "./PeopleTable";
import MaterialTable, { Column } from "material-table";
import axios from "axios";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import styled from "styled-components";

export interface FundDetailsTableProps {
  uploadHandler: Function;
  companyId: number;
}

export interface FundDetailsTableState {
  people: DisplayPerson[];
  columns: Array<Column<DisplayPerson>>;
}

export default class FundDetailsTable extends React.Component<FundDetailsTableProps, FundDetailsTableState> {
  state: FundDetailsTableState = {
    people: [],
    columns: [
      { title: "Name", field: "name" },
      { title: "Current Position", field: "position" }
    ]
  };

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
        this.setState({ people });
      })
      .catch(() => {});
  };

  /**
   * This method sends an AJAX get request to get people
   */
  getPeople = async () => {
    return new Promise<DisplayPerson[]>(resolve => {
      axios
        .get("/people/" + this.props.companyId)
        .then(response => resolve(response.data.data))
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  render() {
    return (
      <Container>
        <MaterialTable
          columns={this.state.columns}
          data={this.state.people}
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
              onClick: (event, rowData) => {
                this.props.uploadHandler();
                this.refreshTable();
              }
            }
          ]}
          components={{
            Toolbar: props => null,
            Pagination: props => null
          }}
          options={{ paging: false, maxBodyHeight: "50vh" }}
        />
      </Container>
    );
  }
}

const Container = styled.div`
  flex: 1;
`;
