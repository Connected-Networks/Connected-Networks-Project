require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../PeopleController";
import CompaniesController from "../../CompaniesController";

describe("UpdateCompany", () => {
  it("should respond with 401 if user is not authorized to change the fund", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockCompany = { id: 123, fundID: mockFundID, name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockCompany } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(false);
    console.error = jest.fn();

    await CompaniesController.updateCompany(mockReq, mockRes);

    expect(mockUserCanChangeFund).toBeCalledWith(mockUserID, mockFundID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should update the company in database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockCompany = { id: 123, fundID: mockFundID, name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockCompany } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockModifyCompany = jest.spyOn(database, "modifyCompany").mockResolvedValue(null);

    await CompaniesController.updateCompany(mockReq, mockRes);

    expect(mockModifyCompany).toBeCalledWith(mockCompany.id, mockCompany.name);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockCompany = { id: 123, fundID: mockFundID, name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockCompany } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockModifyCompany = jest.spyOn(database, "modifyCompany").mockRejectedValue(new Error("Mock error"));

    await PeopleController.updatePerson(mockReq, mockRes);

    await CompaniesController.updateCompany(mockReq, mockRes);

    expect(mockModifyCompany).toBeCalledWith(mockCompany.id, mockCompany.name);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
