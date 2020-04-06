require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../PeopleController";
import CompaniesController from "../../CompaniesController";

describe("DeleteCompany", () => {
  it("should respond with 401 if user is not authorized to change the fund", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 44;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockCompanyID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockRetrieveCompanyByID = jest.spyOn(database, "retrieveCompanyByID").mockResolvedValue({ FundID: mockFundID });
    console.error = jest.fn();

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(false);

    await CompaniesController.deleteCompany(mockReq, mockRes);

    expect(mockRetrieveCompanyByID).toBeCalledWith(mockCompanyID);
    expect(mockUserCanChangeFund).toBeCalledWith(mockUserID, mockFundID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should delete the company in database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 44;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockCompanyID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockRetrieveCompanyByID = jest.spyOn(database, "retrieveCompanyByID").mockResolvedValue({ FundID: mockFundID });
    console.error = jest.fn();
    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockDeleteCompany = jest.spyOn(database, "deleteCompany").mockResolvedValue(null);

    await CompaniesController.deleteCompany(mockReq, mockRes);

    expect(mockDeleteCompany).toBeCalledWith(mockCompanyID);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 44;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockCompanyID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockRetrieveCompanyByID = jest.spyOn(database, "retrieveCompanyByID").mockResolvedValue({ FundID: mockFundID });
    console.error = jest.fn();
    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockDeleteCompany = jest.spyOn(database, "deleteCompany").mockRejectedValue(new Error("Mock error"));

    await CompaniesController.deleteCompany(mockReq, mockRes);

    expect(mockDeleteCompany).toBeCalledWith(mockCompanyID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
