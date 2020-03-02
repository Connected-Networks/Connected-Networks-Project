import ATable from "./ATable";
import { Components } from "material-table";

export interface TableProps {
  dataEndPoint: string;
}

export default abstract class DetailsTable<RowData extends Object> extends ATable<RowData, TableProps> {
  components: Components = {
    Toolbar: props => null,
    Pagination: props => null
  };

  dataEndPoint = this.props.dataEndPoint;
}
