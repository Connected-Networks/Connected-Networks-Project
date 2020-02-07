import ATable from "./ATable";
import IActionsObject from "./IActionsObject";

export interface TableProps {
  uploadHandler: Function;
}

export default abstract class DisplayTable<RowData> extends ATable<RowData, TableProps> {
    
}
