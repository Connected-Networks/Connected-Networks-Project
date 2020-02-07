import * as React from "react";
import styled from "styled-components";
import MaterialTable, { Column } from "material-table";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import DisplayTable from "./DisplayTable";

export interface CompaniesTableProps {
  uploadHandler: Function;
}

interface DisplayCompany {
  id: number;
  name: string;
}

export default class CompaniesTable extends DisplayTable<DisplayCompany> {
  readonly TABLE_NAME = "Companies";

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

  updateRow = async (newData: DisplayCompany, oldData?: DisplayCompany | undefined) => {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  };

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = () => {
    this.getCompanies()
      .then(companies => {
        this.setState({ data: companies });
      })
      .catch(() => {});
  };

  getCompanies = async () => {
    return new Promise<DisplayCompany[]>(resolve => {
      resolve([{ id: 0, name: "" }]);
    });
  };
}
