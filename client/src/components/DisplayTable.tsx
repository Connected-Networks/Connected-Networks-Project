import * as React from "react";
import ATable from "./ATable";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";

export interface TableProps {
  uploadHandler: Function;
}

export default abstract class DisplayTable<RowData> extends ATable<RowData, TableProps> {
  get actionsObject() {
    return [
      {
        icon: () => <ImportIcon fill={"grey"} />,
        tooltip: "Upload CSV",
        isFreeAction: true,
        onClick: () => {
          this.props.uploadHandler();
          this.refreshTable();
        }
      }
    ];
  }
}
