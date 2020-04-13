import axios from "axios";
import * as React from "react";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import CompanyDetailsTable from "./CompanyDetailsTable";
import ShareFundDialog from "./ShareFundDialog";
import AlertDialog from "./AlertDialog";

interface FundTableProps {
  fundID: number;
  fundName: string;
}

interface DisplayFundCompany {
  id: number;
  name: string;
}

export default class FundTable extends ATable<DisplayFundCompany, FundTableProps> {
  state: TableState<DisplayFundCompany> = {
    data: [],
    funds: [],
    columns: [{ title: "Company", field: "name" }],
  };

  get name(): string {
    return this.props.fundName;
  }

  get dataEndPoint(): string {
    return "/funds/" + this.props.fundID;
  }

  isOwnedByUser = (): boolean => {
    if (this.state.funds && this.state.funds.length > 0) {
      const fundOfCompany = this.state.funds.find((fund) => {
        return fund.id === this.props.fundID;
      });
      return fundOfCompany ? !fundOfCompany.shared : false;
    }
    return false;
  };

  onMount = () => {};

  componentDidUpdate(prevProps: FundTableProps, prevState: TableState<DisplayFundCompany>) {
    if (this.props.fundID !== prevProps.fundID) {
      this.setState({ data: [] });
      this.refreshTable();
      this.updateActions();
    }

    if (this.state.funds && this.state.funds.length > 0) {
      this.updateActions();
    }
  }

  updateActions = () => {
    this.actions = this.isOwnedByUser()
      ? [
          {
            icon: "person_add",
            tooltip: "Share fund",
            isFreeAction: true,
            onClick: () => this.showShareDialog(),
          },
          {
            icon: "delete",
            tooltip: "Delete fund",
            isFreeAction: true,
            onClick: () => this.showDeleteDialog(),
          },
        ]
      : [];
  };

  showShareDialog = () => {
    this.setState({
      dialog: <ShareFundDialog fundId={this.props.fundID} handleClose={this.handleCloseDialog} />,
    });
  };

  showDeleteDialog = () => {
    this.setState({
      dialog: (
        <AlertDialog
          title={"Delete this fund?"}
          description={`This action is permanent. Are you sure you want to delete the fund ${this.props.fundName}?`}
          agreeOptionText={"Delete"}
          handleAgreeOption={this.deleteFund}
          handleClose={this.handleCloseDialog}
        />
      ),
    });
  };

  get editableObject(): EditableObject<DisplayFundCompany> {
    if (this.isOwnedByUser()) {
      return {
        onRowAdd: this.addRow,
        onRowUpdate: this.updateRow,
        onRowDelete: this.deleteRow,
      };
    }
    return {};
  }

  deleteFund = () => {
    console.log("I RAN");
    axios
      .delete(`/funds/${this.props.fundID}`)
      .then((response) => {
        window.location.reload(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  addRow = async (newData: DisplayFundCompany): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      axios
        .post(`/company`, {
          newData: { ...newData, fundID: this.props.fundID },
        })
        .then((response) => {
          console.log({ ...newData, fundID: this.props.fundID });
          console.log(this.props.fundID);

          if (response.status === 200) {
            this.refreshTable();
            resolve();
          } else if (response.status === 401) {
            console.error("User does not have permission to edit this fund.");
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

  updateRow = async (newData: DisplayFundCompany, oldData?: DisplayFundCompany | undefined): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      axios
        .put(`/company`, {
          newData: { ...newData, fundID: this.props.fundID },
        })
        .then((response) => {
          if (response.status === 200) {
            this.refreshTable();
            resolve();
          } else if (response.status === 401) {
            console.error("User does not have permission to edit this fund.");
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

  deleteRow = async (oldData: DisplayFundCompany): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      axios
        .delete(`/company/${oldData.id}`)
        .then((response) => {
          if (response.status === 200) {
            this.refreshTable();
            resolve();
          } else if (response.status === 401) {
            console.error("User does not have permission to delete in this fund.");
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

  getDetailPanel = (rowData: DisplayFundCompany) => {
    return (
      <div style={{ marginLeft: "60px", display: "flex" }}>
        <CompanyDetailsTable dataEndPoint={"/people/original/" + rowData.id} />
      </div>
    );
  };
}
