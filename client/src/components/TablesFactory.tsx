import * as React from "react";
import PeopleTable from "./PeopleTable";
import CompaniesTable from "./CompaniesTable";
import FundTable from "./FundTable";

class TablesFactory {
  tableTypes = new Map([
    ["Recent", undefined],
    ["Starred", undefined],
    ["People", <PeopleTable />],
    ["Companies", <CompaniesTable />]
  ]);

  getAvailableTables = () => {
    return Array.from(this.tableTypes.keys());
  };

  getTableComponent = (tableType: string) => {
    if (this.tableTypes.has(tableType)) {
      return this.tableTypes.get(tableType);
    }
    return this.getFundTableWithId(tableType);
  };

  getFundTableWithId = (fundId: string) => {
    return <FundTable dataEndPoint={"/funds/" + fundId} />;
  };

  getDefaultTableType() {
    return "People";
  }
}

export default TablesFactory;
