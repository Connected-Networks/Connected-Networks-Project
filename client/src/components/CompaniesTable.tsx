import axios from "axios";
import { TableState } from "./ATable";
import EditableObject from "./EditableObject";
import DisplayTable from "./DisplayTable";

export interface CompaniesTableProps {
  uploadHandler: Function;
}

interface DisplayCompany {
  id: number;
  name: string;
}

export default class CompaniesTable extends DisplayTable<DisplayCompany> {
  readonly TABLE_NAME = "Companies";

  state: TableState<DisplayCompany> = {
    data: [],
    columns: [{ title: "Name", field: "name" }]
  };

  get editableObject(): EditableObject<DisplayCompany> {
    return {
      onRowUpdate: this.updateRow
    };
  }

  get name(): string {
    return this.TABLE_NAME;
  }

  updateRow = async (newData: DisplayCompany, oldData?: DisplayCompany | undefined) => {
    return new Promise<void>(resolve => {
      if (oldData) {
        console.log(newData);
        this.updateCompanyOnServer(newData).then(() => {
          this.refreshTable();
          resolve();
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

  refreshTable = () => {
    this.getCompanies()
      .then(companies => {
        this.setState({ data: companies });
      })
      .catch(() => {});
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
}
