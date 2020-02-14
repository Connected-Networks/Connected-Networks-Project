import ATable from "./ATable";

export interface TableProps {
  dataEndPoint: string;
}

export default abstract class DisplayTable<RowData extends Object> extends ATable<RowData, TableProps> {
  components = {
    Toolbar: undefined,
    Pagination: undefined
  };

  dataEndPoint = this.props.dataEndPoint;
}
