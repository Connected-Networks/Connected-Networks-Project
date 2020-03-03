import * as React from "react";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import CompanyDetailsTable from "./CompanyDetailsTable";

interface FundTableProps {
  fundId: string;
  fundName: string;
}

interface DisplayFundCompany {
  id: number;
  name: string;
}

export default class FundTable extends ATable<DisplayFundCompany, FundTableProps> {
  readonly DATA_END_POINT = "/funds/" + this.props.fundId;

  state: TableState<DisplayFundCompany> = {
    data: [],
    columns: [{ title: "Company", field: "name" }]
  };

  get name(): string {
    return this.props.fundName;
  }

  get dataEndPoint(): string {
    return this.DATA_END_POINT;
  }

  actions = [
    {
      icon: "person_add",
      tooltip: "Share fund",
      isFreeAction: true,
      onClick: () => this.shareFund()
    }
  ];

  shareFund = () => {
    alert("fund shared");
  };

  get editableObject(): EditableObject<DisplayFundCompany> {
    return {
      onRowAdd: this.addRow,
      onRowUpdate: this.updateRow,
      onRowDelete: this.deleteRow
    };
  }

  addRow = async (newData: DisplayFundCompany): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  };

  updateRow = async (newData: DisplayFundCompany, oldData?: DisplayFundCompany | undefined): Promise<void> => {
    return new Promise(resolve => {
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
