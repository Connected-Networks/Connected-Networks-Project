import * as React from "react";
import PeopleTable from "./PeopleTable";
import CompaniesTable from "./CompaniesTable";
import FundTable from "./FundTable";
import RecentTable from "./RecentTable";

class TablesFactory {
  tableTypes = new Map([
    ["Recent", <RecentTable />],
    ["People", <PeopleTable />],
    ["Companies", <CompaniesTable />],
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
    return <FundTable fundID={Number(fundId)} fundName={fundName} />;
  };

  getDefaultTableType() {
    return "People";
  }
}

export default TablesFactory;
