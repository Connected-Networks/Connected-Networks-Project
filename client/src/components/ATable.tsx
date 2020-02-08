import React from "react";
import MaterialTable, { Column, Action } from "material-table";
import styled from "styled-components";
import EditableObject from "./EditableObject";

export interface TableState<T extends Object> {
  data: T[];
  columns: Array<Column<T>>;
}

// Make abstract class
export default abstract class ATable<T extends Object, TableProps> extends React.Component<TableProps, TableState<T>> {
  abstract get editableObject(): EditableObject<T>;
  abstract get actionsObject(): (Action<T> | ((rowData: T) => Action<T>))[];
  abstract get name(): string;
  abstract refreshTable(): void;

  componentDidMount() {
    this.refreshTable();
  }

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

const Container = styled.div`
  flex: 1;
`;
