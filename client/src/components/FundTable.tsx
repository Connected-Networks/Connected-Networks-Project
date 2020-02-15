import * as React from "react";
import DisplayTable from "./DisplayTable";
import { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import CompanyDetailsTable from "./CompanyDetailsTable";

interface DisplayFundCompany {
  id: number;
  name: string;
}

export default class FundTable extends DisplayTable<DisplayFundCompany> {
  readonly TABLE_NAME = "Funds";

  state: TableState<DisplayFundCompany> = {
    data: [],
    columns: [{ title: "Company", field: "name" }]
  };

  get name(): string {
    return this.TABLE_NAME;
  }

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
