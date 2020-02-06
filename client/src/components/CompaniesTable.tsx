import * as React from "react";
import styled from "styled-components";
import MaterialTable, { Column } from "material-table";
import { ReactComponent as ImportIcon } from "./resources/file-upload.svg";
import axios from "axios";

export interface CompaniesTableProps {
  uploadHandler: Function;
}

export interface CompaniesTableState {
  companies: DisplayCompany[];
  columns: Array<Column<DisplayCompany>>;
}

interface DisplayCompany {
  id: number;
  name: string;
}

const Container = styled.div`
  flex: 1;
`;

class CompaniesTable extends React.Component<CompaniesTableProps, CompaniesTableState> {
  state: CompaniesTableState = {
    companies: [],
    columns: [{ title: "Name", field: "name" }]
  };

  updateRow = async (newData: DisplayCompany, oldData?: DisplayCompany | undefined) => {
    return new Promise<void>(resolve => {
      if (oldData) {
        console.log(newData);
        this.updateCompanyOnServer(newData).then(() => {
          this.refreshTable().then(() => resolve());
        });
      }
    });
  };

  updateCompanyOnServer = async (company: DisplayCompany) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/company", company)
        .then(response => {
          if (response.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  componentDidMount() {
    this.refreshTable();
  }

  refreshTable = async () => {
    return new Promise((resolve, reject) => {
      this.getCompanies()
        .then(companies => {
          this.setState({ companies });
          resolve();
        })
        .catch(() => {});
    });
  };

  getCompanies = async () => {
    return new Promise<DisplayCompany[]>(resolve => {
      axios
        .get("/company")
        .then(response => resolve(response.data.data))
        .catch(function(error) {
          console.log(error);
        });
    });
  };

  render() {
    return (
      <Container>
        <MaterialTable
          columns={this.state.columns}
          data={this.state.companies}
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
