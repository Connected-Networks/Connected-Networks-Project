import * as React from "react";
import PeopleTable from "./PeopleTable";
import CompaniesTable from "./CompaniesTable";
import FundTable from "./FundTable";

class TablesFactory {
  tableTypes: Map<string, JSX.Element | undefined>;
  uploadHandler: Function;

  constructor(uploadHandler: Function) {
    this.tableTypes = new Map([
      ["Recent", undefined],
      ["Starred", undefined],
      ["People", <PeopleTable uploadHandler={uploadHandler} />],
      ["Companies", <CompaniesTable uploadHandler={uploadHandler} />]
    ]);
    this.uploadHandler = uploadHandler;
  }

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
    return <FundTable uploadHandler={this.uploadHandler} dataEndPoint={"/funds/" + fundId} />;
  };

  getDefaultTableType() {
    return "People";
  }
}

export default TablesFactory;
