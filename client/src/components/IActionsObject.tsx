import { Action } from "material-table";

export default interface IActionsObject<RowData extends Object> {
    actions: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[];
}