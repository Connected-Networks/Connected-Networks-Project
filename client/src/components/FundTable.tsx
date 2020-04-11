import axios from "axios";
import * as React from "react";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import CompanyDetailsTable from "./CompanyDetailsTable";
import { User } from "../LoginPage";
import ShareFundDialog from "./ShareFundDialog";

interface FundTableProps {
  fundID: string;
  fundName: string;
}

interface DisplayFundCompany {
  id: number;
  name: string;
}

export default class FundTable extends ATable<DisplayFundCompany, FundTableProps> {
  state: TableState<DisplayFundCompany> = {
    data: [],
    columns: [{ title: "Company", field: "name" }],
  };

  get name(): string {
    return this.props.fundName;
  }

  get dataEndPoint(): string {
    return "/funds/" + this.props.fundID;
  }

  actions = [
    {
      icon: "person_add",
      tooltip: "Share fund",
      isFreeAction: true,
      onClick: () => this.showShareDialog(),
    },
  ];

  componentDidUpdate(prevProps: FundTableProps) {
    if (this.props.fundID !== prevProps.fundID) {
      this.setState({ data: [] });
      this.refreshTable();
    }
  }

  showShareDialog = () => {
    this.setState({
      dialog: <ShareFundDialog fundId={this.props.fundID} handleClose={this.handleCloseDialog} />,
    });
  };

  get editableObject(): EditableObject<DisplayFundCompany> {
    return {
      onRowAdd: this.addRow,
      onRowUpdate: this.updateRow,
      onRowDelete: this.deleteRow,
    };
  }

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
    return new Promise((resolve) => {
      resolve();
    });
  };

  deleteRow = async (oldData: DisplayFundCompany): Promise<void> => {
    return new Promise((resolve, reject) => {
      resolve();
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
