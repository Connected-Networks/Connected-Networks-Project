import ATable from "./ATable";

export interface TableProps {
  dataEndPoint: string;
}

export default abstract class DisplayTable<RowData extends Object> extends ATable<RowData, TableProps> {
  

  dataEndPoint = this.props.dataEndPoint;
}
