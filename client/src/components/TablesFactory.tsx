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

  getTableComponent = (tableType: string, fundName?: string) => {
    if (this.tableTypes.has(tableType)) {
      return this.tableTypes.get(tableType);
    }
    return this.getFundTableWithId(tableType, fundName);
  };

  getFundTableWithId = (fundId: string, fundName: string = "Name not found") => {
    return <FundTable fundId={fundId} fundName={fundName} />;
  };

  getDefaultTableType() {
    return "People";
  }
}

export default TablesFactory;
