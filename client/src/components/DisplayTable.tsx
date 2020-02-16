import * as React from "react";
import ATable from "./ATable";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import { Action } from "material-table";

export interface TableProps {
  dataEndPoint: string;
}

export default abstract class DisplayTable<RowData extends Object> extends ATable<RowData, TableProps> {
  getExtraActions: () => (Action<RowData> | ((rowData: RowData) => Action<RowData>))[] = () => {
    return [];
  };

  actions = [...this.getExtraActions()];
  dataEndPoint = this.props.dataEndPoint;
}
