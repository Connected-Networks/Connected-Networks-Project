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
    return `/history/${this.props.person.id}`;
  }

  get editableObject(): EditableObject<DisplayHistory> {
    return {
      onRowUpdate: this.updateRow,
      onRowDelete: this.deleteRow,
      onRowAdd: this.addRow,
    };
  }

  updateRow = async (newData: DisplayHistory, oldData?: DisplayHistory | undefined): Promise<void> => {
    if (oldData) {
      try {
        await axios.put("/history", { newData });
      } catch (error) {
        console.log(error);
      }
      this.refreshTable();
    }
  };

  addRow = async (newData: DisplayHistory): Promise<void> => {
    if (newData) {
      try {
        await axios.post(`/history`, { newData, employee: this.props.person });
      } catch (error) {
        console.log(error);
      }
      this.refreshTable();
    }
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
