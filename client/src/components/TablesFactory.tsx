import * as React from "react";
import PeopleTable from "./PeopleTable";
import CompaniesTable from "./CompaniesTable";

class TablesFactory {
  tableTypes: Map<string, JSX.Element | undefined>;

  constructor(uploadHandler: Function) {
    this.tableTypes = new Map([
      ["Recent", undefined],
      ["Starred", undefined],
      ["People", <PeopleTable uploadHandler={uploadHandler} />],
      ["Companies", <CompaniesTable uploadHandler={uploadHandler} />]
    ]);
  }

  getAvailableTables = () => {
    return Array.from(this.tableTypes.keys());
  };

  getTableComponent = (tableType: string) => {
    return this.tableTypes.get(tableType);
  };

  getDefaultTableType() {
    return "People";
  }
}

export default TablesFactory;
