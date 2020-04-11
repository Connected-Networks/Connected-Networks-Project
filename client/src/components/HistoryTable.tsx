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
        await axios.put("/history", { newData, employee: this.props.person });
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
    try {
      const historyID = oldData.id;
      await axios.delete(`/history/${historyID}`, { data: { employee: this.props.person } });
    } catch (error) {
      console.log(error);
    }
    this.refreshTable();
  };
}
