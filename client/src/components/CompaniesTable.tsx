import * as React from "react";
import styled from "styled-components";
import MaterialTable, { Column } from "material-table";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import ATable, { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import DisplayTable from "./DisplayTable";
import("./EditableObject");
import("./IActionsObject");

export interface CompaniesTableProps {
  uploadHandler: Function;
}

interface DisplayCompany {
  id: number;
  name: string;
}

const Container = styled.div`
  flex: 1;
`;

const getTableName = () => {
  return "Companies";
};

class CompaniesEditableObject implements EditableObject<DisplayCompany> {
  onRowUpdate = async (newData: DisplayCompany, oldData?: DisplayCompany | undefined) => {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  };
}

export default class CompaniesTable extends DisplayTable<DisplayCompany> {
  get editableObject(): CompaniesEditableObject {
    return new CompaniesEditableObject();
  }

  get name(): string {
    return getTableName();
  }

  state: TableState<DisplayCompany> = {
    data: [],
    columns: [{ title: "Name", field: "name" }]
  };

  updateRow = async (newData: DisplayCompany, oldData?: DisplayCompany | undefined) => {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  };

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = () => {
    this.getCompanies()
      .then(companies => {
        this.setState({ data: companies });
      })
      .catch(() => {});
  };

  getCompanies = async () => {
    return new Promise<DisplayCompany[]>(resolve => {
      resolve([{ id: 0, name: "" }]);
    });
  };

  render() {
    return (
      <Container>
        <MaterialTable
          columns={this.state.columns}
          data={this.state.data}
          editable={new CompaniesEditableObject()}
          title="Companies"
          actions={[
            {
              icon: () => <ImportIcon fill={"grey"} />,
              tooltip: "Upload CSV",
              isFreeAction: true,
              onClick: (event, rowData) => {
                this.props.uploadHandler();
                this.refreshTable();
              }
            }
          ]}
        />
      </Container>
    );
  }
}
