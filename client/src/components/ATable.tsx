import React from "react";
import MaterialTable, { Column } from "material-table";

// Make abstract class
export default abstract class ATable<T extends Object> extends React.Component<TableProps, TableState<T>> {
    abstract get name() : String
}

export interface TableProps {
    uploadHandler: Function;
}

export interface TableState<T extends Object> {
    data: T[];
    columns: Array<Column<T>>;
  }