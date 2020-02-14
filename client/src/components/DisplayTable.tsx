import * as React from "react";
import ATable from "./ATable";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import { Action } from "material-table";

export interface TableProps {
  uploadHandler: Function;
  dataEndPoint: string;
}

export default abstract class DisplayTable<RowData extends Object> extends ATable<RowData, TableProps> {
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

  actions = [this.uploadAction, ...this.getExtraActions()];
  dataEndPoint = this.props.dataEndPoint;
}
