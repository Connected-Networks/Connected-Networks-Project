import React from "react";
import MaterialTable, { Column, Action } from "material-table";
import { Container } from "@material-ui/core";
import EditableObject from "./EditableObject";
import IActionsObject from "./IActionsObject";

// Make abstract class
export default abstract class ATable<T extends Object, TableProps> extends React.Component<TableProps, TableState<T>> {
  abstract get editableObject(): EditableObject<T>;
  abstract get actionsObject(): (Action<T> | ((rowData: T) => Action<T>))[];
  abstract get name(): string;
  abstract refreshTable(): void;
  render() {
    return (
      <Container>
        <MaterialTable
          columns={this.state.columns}
          data={this.state.data}
          editable={this.editableObject}
          title={this.name}
          actions={this.actionsObject}
        />
      </Container>
    );
  }
}

export interface TableState<T extends Object> {
  data: T[];
  columns: Array<Column<T>>;
}
