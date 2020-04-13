import ATable from "./ATable";
import { DisplayPerson, DisplayFund } from "./PeopleTable";
import EditableObject from "./EditableObject";
import Axios from "axios";

export default class RecentTable extends ATable<DisplayPerson> {
  readonly TABLE_NAME = "Recent";
  readonly DATA_END_POINT = "/people/recent";

  funds: DisplayFund[] = [];

  get name(): string {
    return this.TABLE_NAME;
  }

  get dataEndPoint(): string {
    return this.DATA_END_POINT;
  }

  get editableObject(): EditableObject<DisplayPerson> {
    return {};
  }

  componentDidMount() {
    Axios.get("/funds")
      .then((response) => {
        this.funds = response.data.data;
        this.refreshTable();
      })
      .catch((error) => console.error(error));
  }

  state = {
    data: [],
    columns: [
      { title: "Name", field: "name" },
      {
        title: "Fund",
        field: "fundID",
        render: (rowData: any) => (rowData ? this.findFund(rowData.fundID) : "Fund does not exist"),
      },
      { title: "Company", field: "company" },
      { title: "Position", field: "position" },
      { title: "Last Changed", field: "lastChanged" },
    ],
  };

  findFund = (fundID: number): string => {
    let found = this.funds.find((fund: DisplayFund) => {
      return fund.id == fundID;
    });

    return found ? found.name : " ";
  };
}
