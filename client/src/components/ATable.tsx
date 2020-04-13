import React, { ReactNode } from "react";
import MaterialTable, { Column, Action, DetailPanel, Components } from "material-table";
import styled from "styled-components";
import EditableObject from "./EditableObject";
import axios from "axios";
import { TablePagination } from "@material-ui/core";
import { DisplayFund } from "./PeopleTable";

export interface TableState<T extends Object> {
  data: T[];
  columns: Array<Column<T>>;
  dialog?: JSX.Element;
  funds?: DisplayFund[];
}

export default abstract class ATable<T extends Object, TableProps = {}> extends React.Component<TableProps, TableState<T>> {
  abstract get editableObject(): EditableObject<T>;
  abstract get name(): string;
  abstract get dataEndPoint(): string;

  components: Components | undefined = undefined;

  actions: (Action<T> | ((rowData: T) => Action<T>))[] | undefined = undefined;

  getDetailPanel: ((rowData: T) => ReactNode) | undefined = undefined;

  parseFunds = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/funds")
        .then((response) => {
          if (response.status === 200) {
            this.setState({ funds: response.data.data });
            resolve();
          } else {
            reject();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };

  componentDidMount() {
    if (this.state.funds) {
      this.parseFunds();
    }
    this.onMount();
    this.refreshTable();
  }

  onMount = () => {};

  refreshTable = () => {
    this.getData()
      .then((data) => {
        this.setState({ data });
      })
      .catch(() => {});
  };

  getData = async () => {
    return new Promise<T[]>((resolve) => {
      axios
        .get(this.dataEndPoint)
        .then((response) => resolve(response.data.data))
        .catch(function (error) {
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
            components={
              (this.components,
              {
                Pagination: (props) => {
                  console.log(props);
                  let propsToPass = {
                    ...props,
                    rowsPerPageOptions: [5, 10, 25, 50, { label: "All", value: this.state.data.length }],
                  };
                  return <TablePagination {...propsToPass} />;
                },
              })
            }
            detailPanel={this.getDetailPanel}
            onRowClick={(event, rowData, togglePanel) => (this.getDetailPanel ? togglePanel!() : undefined)}
            options={{
              actionsColumnIndex: -1,
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
