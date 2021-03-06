import axios from "axios";
import EditableObject from "./EditableObject";
import React, { ReactNode } from "react";
import MaterialTable, { Column, DetailPanel } from "material-table";
import styled from "styled-components";
import HistoryTable from "./HistoryTable";
import Comment from "./Comment";
import FundsAutoComplete from "./FundsAutoComplete";
import CompaniesAutoComplete from "./CompaniesAutoComplete";
import HyperlinkArea from "./HyperlinkArea";
import { TablePagination, Snackbar } from "@material-ui/core";
import SharedIcon from "@material-ui/icons/People";
import Alert from "@material-ui/lab/Alert";

interface PeopleTableState {
  data: DisplayPerson[];
  columns: Array<Column<DisplayPerson>>;
  funds: DisplayFund[];
  selectedFundID?: number;
  selectedCompanyID?: number;
  selectedCompany?: string;
  dialog?: JSX.Element;
  alertMessage?: string;
  openAlert: boolean;
}

interface PeopleTableProps {}

export interface DisplayFund {
  id: number;
  name: string;
  shared: boolean;
}

export interface DisplayPerson {
  id: number;
  fundID: number;
  name: string;
  company: string;
  companyID: number;
  position: string;
  comment: string;
  hyperlink: string;
  lastChanged: string;
  shared?: boolean;
}

export default class PeopleTable extends React.Component<PeopleTableProps, PeopleTableState> {
  readonly TABLE_NAME = "People";
  readonly DATA_END_POINT = "/people";

  state: PeopleTableState = {
    data: [],
    columns: [
      {
        title: "Name",
        field: "name",
        render: (rowData) => {
          if (rowData.hyperlink) {
            return (
              <a href={rowData.hyperlink} target="_blank">
                {rowData.name}
              </a>
            );
          }
          return rowData.name;
        },
      },
      {
        title: "Fund",
        field: "fundID",
        editComponent: (tableData) => {
          if (tableData.rowData.id) {
            return <> {this.findFund(tableData.rowData.fundID)} </>;
          }
          return <FundsAutoComplete handleSelectFund={(selectedFundID: number) => this.setState({ selectedFundID })} />;
        },
        render: (rowData) => (rowData ? this.findFund(rowData.fundID) : "Fund does not exist"),
      },
      {
        title: "Company",
        field: "company",
        editComponent: (tableData) => {
          if (tableData.rowData.id) {
            return <> {tableData.rowData.company} </>;
          }

          if (this.state.selectedFundID) {
            return (
              <CompaniesAutoComplete
                fundID={this.state.selectedFundID}
                handleSelectCompany={(selectedCompanyID: number, selectedCompany: string) =>
                  this.setState({ selectedCompanyID, selectedCompany })
                }
              />
            );
          }

          return <> No fund selected </>;
        },
      },
      { title: "Position", field: "position" },
      {
        title: "Last Changed",
        field: "lastChanged",
        editable: "never",
        render: (rowData) => {
          if (rowData && rowData.lastChanged) {
            const today = new Date();
            const dayOfLastChange = new Date(rowData.lastChanged);
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 8);
            if (today.getDate() >= dayOfLastChange.getDate() && dayOfLastChange.getDate() >= lastWeek.getDate()) {
              return <b style={{ color: "orange" }}> {rowData.lastChanged}</b>;
            }
            return rowData.lastChanged;
          }
        },
      },
      {
        title: "Shared",
        field: "shared",
        editable: "never",
        render: (rowData: DisplayPerson) => {
          if (!this.isOwnedByUser(rowData)) {
            return <SharedIcon />;
          }
        },
      },
    ],
    funds: [],
    selectedFundID: undefined,
    selectedCompanyID: undefined,
    selectedCompany: undefined,
    openAlert: false,
  };

  findFund = (fundID: number): string => {
    let found = this.state.funds.find((fund: DisplayFund) => {
      return fund.id == fundID;
    });

    return found ? found.name : " ";
  };

  isOwnedByUser = (person: DisplayPerson) => {
    if (person) {
      const fundOfPerson = this.state.funds.find((fund) => fund.id === person.fundID);
      return fundOfPerson ? !fundOfPerson.shared : false;
    }
    return true;
  };

  get editableObject(): EditableObject<DisplayPerson> {
    return {
      isEditable: this.isOwnedByUser,
      isDeletable: this.isOwnedByUser,
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
    | Array<DetailPanel<DisplayPerson> | ((rowData: DisplayPerson) => DetailPanel<DisplayPerson>)>
    | undefined = (rowData: DisplayPerson) => {
    const isOwnedByUser = this.isOwnedByUser(rowData);
    return (
      <div style={{ marginLeft: "60px", borderLeft: "1px solid lightgrey" }}>
        <HyperlinkArea person={rowData} isOwned={isOwnedByUser} />
        <Comment person={rowData} isOwned={isOwnedByUser} />
        <HistoryTable person={rowData} isOwned={isOwnedByUser} />
      </div>
    );
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
  updateRow = async (newData: DisplayPerson, oldData?: DisplayPerson | undefined): Promise<void> => {
    return new Promise((resolve) => {
      if (oldData) {
        console.log(newData);
        this.updatePersonOnServer(newData).then(() => {
          this.refreshTable();
          resolve();
        });
      }
    });
  };

  updatePersonOnServer = async (newData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/people", { newData: { ...newData } })
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
      if (!this.state.selectedFundID || !this.state.selectedCompanyID) {
        this.notifyUser("Fund or company were not selected");
        reject();
        return;
      }
      newData.fundID = this.state.selectedFundID!;
      newData.companyID = this.state.selectedCompanyID!;
      newData.company = this.state.selectedCompany!;

      if (newData) {
        console.log(newData);
        this.addPersonOnServer(newData).then(() => {
          resolve();
        });
      }
    });
  };

  addPersonOnServer = async (newData: DisplayPerson) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`/people`, { newData: { ...newData, hyperlink: "" } })
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

  notifyUser = (message: string) => {
    this.setState({ alertMessage: message, openAlert: true });
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
            onRowClick={this.getDetailPanel ? (event, rowData, togglePanel) => togglePanel!() : undefined}
            options={{
              actionsColumnIndex: -1,
            }}
            components={{
              Pagination: (props) => {
                console.log(props);
                let propsToPass = {
                  ...props,
                  rowsPerPageOptions: [5, 10, 25, 50, { label: "All", value: this.state.data.length }],
                };
                return <TablePagination {...propsToPass} />;
              },
            }}
          />
        </Container>
        <Snackbar open={this.state.openAlert} autoHideDuration={6000} onClose={() => this.setState({ openAlert: false })}>
          <Alert variant="filled" onClose={() => this.setState({ openAlert: false })} severity="error">
            {this.state.alertMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }
}

const Container = styled.div`
  flex: 1;
`;
