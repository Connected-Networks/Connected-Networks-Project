import axios from "axios";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import React, { ReactNode } from "react";
import MaterialTable, { Column, DetailPanel } from "material-table";
import styled from "styled-components";
import FundsDropdown from "./FundsDropdown";

interface PeopleTableState {
  data: DisplayPerson[];
  columns: Array<Column<DisplayPerson>>;
  funds: DisplayFund[];
  dialog?: JSX.Element;
}

interface PeopleTableProps {}

export interface DisplayFund {
  id: number;
  name: string;
}

export interface DisplayPerson {
  id: number;
  fundID: number;
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

export default class PeopleTable extends React.Component<
  PeopleTableProps,
  PeopleTableState
> {
  readonly TABLE_NAME = "People";
  readonly DATA_END_POINT = "/people";

  state: PeopleTableState = {
    data: [],
    columns: [
      {
        title: "Fund",
        field: "fundID",
        editComponent: (tableData) => {
          if (tableData.rowData.fundID) {
            return <> {this.findFund(tableData.rowData.fundID)} </>;
          }

          return (
            <FundsDropdown
              fundsList={this.state.funds}
              onSelect={(newFundID: number) => {
                tableData.rowData.fundID = newFundID;
              }}
              initialFundID={
                this.state.funds.length > 0 ? this.state.funds[0].id : -1
              }
            />
          );
        },
        render: (rowData) => {
          return rowData ? this.findFund(rowData.fundID) : " ";
        },
      },
      { title: "Name", field: "name" },
      { title: "Company", field: "company" },
      { title: "Position", field: "position" },
    ],
    funds: [],
  };

  findFund = (fundID: number): string => {
    let found = this.state.funds.find((fund: DisplayFund) => {
      return fund.id == fundID;
    });

    return found ? found.name : " ";
  };

  createLookupTable = () => {};

  get editableObject(): EditableObject<DisplayPerson> {
    return {
      onRowAdd: this.addRow,
      onRowUpdate: this.updateRow,
      onRowDelete: this.deleteRow,
    };
  }

  get name(): string {
    return this.TABLE_NAME;
  }

  get dataEndPoint(): string {
    return this.DATA_END_POINT;
  }

  getDetailPanel:
    | ((rowData: DisplayPerson) => ReactNode)
    | Array<
        | DetailPanel<DisplayPerson>
        | ((rowData: DisplayPerson) => DetailPanel<DisplayPerson>)
      >
    | undefined = () => {
    return undefined;
  };

  parseFunds = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/funds")
        .then((response) => {
          if (response.status === 200) {
            this.setState({ funds: response.data.data });
            resolve();
          } else {
            reject();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  /**
   * This method takes two rows and updates the old row on the table with the new one
   *
   * @param newData
   * @param oldData
   */
  updateRow = async (
    newData: DisplayPerson,
    oldData?: DisplayPerson | undefined
  ): Promise<void> => {
    return new Promise((resolve) => {
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

  updatePersonOnServer = async (newData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/people", { newData: { ...newData, hyperlink: "" } })
        .then((response) => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function (error) {
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
        .post(`/people`, { newData: { ...newData, hyperlink: "hi" } })
        .then((response) => {
          if (response.status === 200) {
            this.refreshTable();
            resolve();
          } else {
            this.refreshTable();
            reject();
          }
        })
        .catch(function (error) {
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
        .then((response) => {
          console.log("status: " + response.status);
          resolve();
        })
        .catch(function (error) {
          console.log(error);
          reject();
        });
    });
  };

  componentDidMount() {
    this.parseFunds();
    this.refreshTable();
  }

  refreshTable = () => {
    this.getData()
      .then((data) => {
        this.setState({ data });
      })
      .catch(() => {});
  };

  getData = async () => {
    return new Promise<DisplayPerson[]>((resolve) => {
      axios
        .get(this.dataEndPoint)
        .then((response) => resolve(response.data.data))
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  handleCloseDialog = () => {
    this.setState({ dialog: undefined });
  };

  render() {
    return (
      <>
        <Container>
          <MaterialTable
            columns={this.state.columns}
            data={this.state.data}
            editable={this.editableObject}
            title={this.name}
            detailPanel={this.getDetailPanel}
            onRowClick={
              this.getDetailPanel
                ? (event, rowData, togglePanel) => togglePanel!()
                : undefined
            }
            options={{
              actionsColumnIndex: -1,
            }}
          />
        </Container>
        {this.state.dialog}
      </>
    );
  }
}

const Container = styled.div`
  flex: 1;
`;
