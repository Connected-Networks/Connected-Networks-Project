require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

import RouterTestingUtils, { CrudType } from "../../RouterTestingUtils";
import CompaniesController from "../../CompaniesController";

describe("Router", () => {
  it("should use CompaniesController.getCompanies for get /company", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.GET, "/company", CompaniesController.getCompanies);
  });

  it("should use CompaniesController.updateCompany for put /company", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.PUT, "/company", CompaniesController.updateCompany);
  });

  it("should use CompaniesController.addCompany for post /company", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.POST, "/company", CompaniesController.addCompany);
  });

  it("should use CompaniesController.deleteCompany for delete /company/:id", () => {
    RouterTestingUtils.testApiUsedFunction(CrudType.DELETE, "/company/:id", CompaniesController.deleteCompany);
  });
});
