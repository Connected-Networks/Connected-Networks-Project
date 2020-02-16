import * as React from "react";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import CompanyDetailsTable from "./CompanyDetailsTable";
import axios from "axios";

export interface DisplayCompany {
  id: number;
  name: string;
}

export default class CompaniesTable extends ATable<DisplayCompany, any> {
  readonly TABLE_NAME = "Companies";
  readonly DATA_END_POINT = "/company";

  state: TableState<DisplayCompany> = {
    data: [],
    columns: [{ title: "Name", field: "name" }]
  };

  get editableObject(): EditableObject<DisplayCompany> {
    return {
      onRowUpdate: this.updateRow
    };
  }

  get name(): string {
    return this.TABLE_NAME;
  }

  get dataEndPoint(): string {
    return this.DATA_END_POINT;
  }

  getDetailPanel = (rowData: DisplayCompany) => {
    return (
      <div style={{ marginLeft: "60px" }}>
        <CompanyDetailsTable dataEndPoint={"/people/" + rowData.id} />
      </div>
    );
  };

  updateRow = async (newData: DisplayCompany, oldData?: DisplayCompany | undefined) => {
    return new Promise<void>(resolve => {
      if (oldData) {
        console.log(newData);
        this.updateCompanyOnServer(newData).then(() => {
          this.refreshTable();
          resolve();
        });
      }
    });
  };

  updateCompanyOnServer = async (company: DisplayCompany) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/company", company)
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
}
