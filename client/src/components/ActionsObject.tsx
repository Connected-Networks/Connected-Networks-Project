import { Action } from "material-table";

export default interface ActionsObject<RowData extends Object> {
    actions: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[];
}