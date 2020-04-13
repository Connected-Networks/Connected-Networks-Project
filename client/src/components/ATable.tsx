import React, { ReactNode } from "react";
import MaterialTable, { Column, Action, DetailPanel, Components } from "material-table";
import styled from "styled-components";
import EditableObject from "./EditableObject";
import axios from "axios";

export interface TableState<T extends Object> {
  data: T[];
  columns: Array<Column<T>>;
  dialog?: JSX.Element;
}

export default abstract class ATable<T extends Object, TableProps = {}> extends React.Component<TableProps, TableState<T>> {
  abstract get editableObject(): EditableObject<T>;
  abstract get name(): string;
  abstract get dataEndPoint(): string;

  components: Components | undefined = undefined;

  actions: (Action<T> | ((rowData: T) => Action<T>))[] | undefined = undefined;

  getDetailPanel: ((rowData: T) => ReactNode) | Array<DetailPanel<T> | ((rowData: T) => DetailPanel<T>)> | undefined = () => {
    return undefined;
  };

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = () => {
    this.getData()
      .then(data => {
        this.setState({ data });
      })
      .catch(() => {});
  };

  getData = async () => {
    return new Promise<T[]>(resolve => {
      axios
        .get(this.dataEndPoint)
        .then(response => resolve(response.data.data))
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  handleCloseDialog = () => {
    this.setState({ dialog: undefined });
  };

  render() {
    return (
      <>
        <Container>
          <MaterialTable
            columns={this.state.columns}
            data={this.state.data}
            editable={this.editableObject}
            title={this.name}
            actions={this.actions}
            components={this.components}
            detailPanel={this.getDetailPanel}
            onRowClick={this.getDetailPanel ? (event, rowData, togglePanel) => togglePanel!() : undefined}
            options={{
              actionsColumnIndex: -1
            }}
          />
        </Container>
        {this.state.dialog}
      </>
    );
  }
}

const Container = styled.div`
  flex: 1;
`;
