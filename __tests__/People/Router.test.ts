require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

import RouterTestingUtils, { CrudType } from "../../RouterTestingUtils";
import PeopleController from "../../PeopleController";

describe("Router", () => {
  it("should use PeopleController.getPeople for get /people", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.GET, "/people", PeopleController.getPeople);
  });

  it("should use PeopleController.getPeopleByCompany for get /people/:companyID", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.GET, "/people/:companyId", PeopleController.getPeopleByCompany);
  });

  it("should use PeopleController.getPeopleByOriginalCompany for get /people/original/:companyID", () => {
    RouterTestingUtils.testApiUsedFunction(
      CrudType.GET,
      "/people/original/:companyID",
      PeopleController.getPeopleByOriginalCompany
    );
  });

  it("should use PeopleController.updatePerson for put /people", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.PUT, "/people", PeopleController.updatePerson);
  });

  it("should use PeopleController.addPerson for post /people", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.POST, "/people", PeopleController.addPerson);
  });

  it("should use PeopleController.deletePerson for delete /people/:id", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.DELETE, "/people/:id", PeopleController.deletePerson);
  });
});
