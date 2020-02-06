import * as React from "react";
import styled from "styled-components";
import MaterialTable, { Column } from "material-table";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import ATable, { TableState, TableProps } from "./ATable";

export interface CompaniesTableProps {
  uploadHandler: Function;
}

// export interface CompaniesTableState {
//   companies: DisplayCompany[];
//   columns: Array<Column<DisplayCompany>>;
// }

interface DisplayCompany {
  id: number;
  name: string;
}

const Container = styled.div`
  flex: 1;
`;

const getTableName = () => {
  return "Companies";
}

class CompaniesTable extends ATable<DisplayCompany> {
  
  get name(): String {
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
        this.setState({ data:companies });
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
          editable={{
            onRowUpdate: this.updateRow
          }}
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

export default CompaniesTable;
