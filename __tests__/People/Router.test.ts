require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

import RouterTestingUtils, { CrudType } from "../../RouterTestingUtils";
import PeopleController from "../../PeopleController";

describe("Router", () => {
  it("should use PeopleController.getPeople for get /people", async () => {
    RouterTestingUtils.testRouterAPI(CrudType.GET, "/people", PeopleController.getPeople);
  });

  it("should use PeopleController.getPeopleOfCompany for get /people/:companyId", async () => {
    RouterTestingUtils.testRouterAPI(CrudType.GET, "/people/:companyId", PeopleController.getPeopleOfCompany);
  });
});
