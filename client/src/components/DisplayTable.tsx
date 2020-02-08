import * as React from "react";
import ATable from "./ATable";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import { Action } from "material-table";

export interface TableProps {
  uploadHandler: Function;
}

export default abstract class DisplayTable<RowData extends Object> extends ATable<RowData, TableProps> {
  get actionsObject() {
    return this.getActions();
  }

  getActions: () => (Action<RowData> | ((rowData: RowData) => Action<RowData>))[] = () => {
    return [this.uploadAction, ...this.getExtraActions()];
  };

  uploadAction = {
    icon: () => <ImportIcon fill={"grey"} />,
    tooltip: "Upload CSV",
    isFreeAction: true,
    onClick: () => {
      this.props.uploadHandler();
      this.refreshTable();
    }
  };

  getExtraActions: () => (Action<RowData> | ((rowData: RowData) => Action<RowData>))[] = () => {
    return [];
  };
}
