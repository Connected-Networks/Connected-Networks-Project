import EditableObject from "./EditableObject";
import axios from "axios";
import ATable from "./ATable";
import { DisplayPerson } from "./PeopleTable";

interface TableProps {
  person: DisplayPerson;
}

interface DisplayHistory {
  id: number;
  company: string;
  position: string;
  start: string;
  end: string;
}

export default class HistoryTable extends ATable<DisplayHistory, TableProps> {
  state = {
    data: [],
    columns: [
      { title: "Company", field: "company" },
      { title: "Current Position", field: "position" },
      { title: "Start date", field: "start" },
      { title: "End date", field: "end" },
    ],
  };

  get name(): string {
    return "Employment History";
  }

  get dataEndPoint(): string {
    return "/history";
  }

  get editableObject(): EditableObject<DisplayHistory> {
    return {
      onRowUpdate: this.updateRow,
      onRowDelete: this.deleteRow,
      onRowAdd: this.addRow,
    };
  }

  updateRow = async (newData: DisplayHistory, oldData?: DisplayHistory | undefined): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (oldData) {
          console.log(newData);
          this.updatePersonOnServer(newData).then(() => {
            this.refreshTable();
            resolve();
          });
        }
      }, 600);
    });
  };

  updatePersonOnServer = async (newData: DisplayHistory) => {
    return new Promise((resolve, reject) => {
      axios
        .put("/history", { newData })
        .then((response) => {
          if (response.status === 200) {
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

  addRow = async (newData: DisplayHistory): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if (newData) {
        console.log(newData);
        this.addPersonOnServer(newData)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            resolve();
          });
      }
    });
  };

  addPersonOnServer = async (newData: DisplayHistory) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`/history`, { newData, employee: this.props.person })
        .then((response) => {
          console.log("YUUUUUUUUp");

          if (response.status === 200) {
            this.refreshTable();
            resolve();
          } else {
            this.refreshTable();
            reject();
          }
        })
        .catch((error) => {
          console.log("NOOOOOOOOOOpe");
          console.log(error);
          this.refreshTable();
          reject();
        });
    });
  };

  deleteRow = async (oldData: DisplayHistory): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.deletePersonOnServer(oldData)
          .then(() => {
            this.refreshTable();
            resolve();
          })
          .catch(() => {
            this.refreshTable();
            resolve();
          });
      }, 1000);
    });
  };

  deletePersonOnServer = async (oldData: DisplayHistory) => {
    return new Promise((resolve, reject) => {
      const historyID = oldData.id;
      axios
        .delete(`/history/${historyID}`)
        .then((response) => {
          console.log("status: " + response.status);
          resolve();
        })
        .catch(function (error) {
          console.log(error);
          reject();
        });
    });
  };

  // state = { :  }
}
