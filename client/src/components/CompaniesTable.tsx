import * as React from "react";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import CompanyDetailsTable from "./CompanyDetailsTable";
import axios from "axios";

export interface DisplayCompany {
  id: number;
  fundID: number;
  name: string;
}

export default class CompaniesTable extends ATable<DisplayCompany> {
  readonly TABLE_NAME = "Companies";
  readonly DATA_END_POINT = "/company";

  state: TableState<DisplayCompany> = {
    data: [],
    funds: [],
    columns: [{ title: "Name", field: "name" }],
  };

  get editableObject(): EditableObject<DisplayCompany> {
    return {
      isEditable: this.isOwnedByUser,
      onRowUpdate: this.updateRow,
    };
  }

  get name(): string {
    return this.TABLE_NAME;
  }

  get dataEndPoint(): string {
    return this.DATA_END_POINT;
  }

  isOwnedByUser = (company: DisplayCompany): boolean => {
    if (this.state.funds) {
      const fundOfCompany = this.state.funds.find((fund) => fund.id === company.fundID);
      return fundOfCompany ? !fundOfCompany.shared : false;
    }
    return false;
  };

  getDetailPanel = (rowData: DisplayCompany) => {
    return (
      <div style={{ marginLeft: "60px" }}>
        <CompanyDetailsTable name={rowData.name} dataEndPoint={"/people/" + rowData.id} />
      </div>
    );
  };

  updateRow = async (newData: DisplayCompany, oldData?: DisplayCompany | undefined) => {
    return new Promise<void>((resolve) => {
      if (oldData) {
        console.log(newData);
        this.updateCompanyOnServer(newData).then(() => {
          this.refreshTable();
          resolve();
        });
      }
    });
  };

  updateCompanyOnServer = async (newData: DisplayCompany) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/company", { newData })
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
}
