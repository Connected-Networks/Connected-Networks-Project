require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../../sequelizeDatabase/sequelFunctions");
const database = require("../../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../../PeopleController";

describe("GetPeopleByCompany", () => {
  it("should respond with 401 if user is not authorized to see the company", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { companyID: mockCompanyID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserSeesCompany = jest.spyOn(PeopleController, "userSeesCompany").mockResolvedValue(false);

    await PeopleController.getPeopleByCompany(mockReq, mockRes);

    expect(mockUserSeesCompany).toBeCalledWith(mockUserID, mockCompanyID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should respond with people got from database", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { companyID: mockCompanyID } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };

    const mockPeople = [{ id: 123, fundID: 1, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" }];

    const mockUserSeesCompany = jest.spyOn(PeopleController, "userSeesCompany").mockResolvedValue(true);
    const mockRetrieveCurrentEmployeesOfCompany = jest
      .spyOn(database, "retrieveCurrentEmployeesOfCompany")
      .mockResolvedValue(mockPeople);

    await PeopleController.getPeopleByCompany(mockReq, mockRes);

    expect(mockRetrieveCurrentEmployeesOfCompany).toBeCalledWith(mockCompanyID);
    expect(mockSend).toBeCalledWith({ data: mockPeople });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { companyID: mockCompanyID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserSeesCompany = jest.spyOn(PeopleController, "userSeesCompany").mockResolvedValue(true);
    const mockRetrieveCurrentEmployeesOfCompany = jest
      .spyOn(database, "retrieveCurrentEmployeesOfCompany")
      .mockRejectedValue(new Error("Mock error"));

    await PeopleController.getPeopleByCompany(mockReq, mockRes);

    expect(mockSendStatus).toBeCalledWith(500);
  });
});

describe("UserSeesCompany", () => {
  it("should return true if user sees the fund of the company", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockFundID = 3243;
    const mockCompany = { FundID: mockFundID };
    const mockFunds = ["5342", "3243", "54321", "", "12345"];

    const mockGetFundsUserCanSee = jest.spyOn(database, "getFundsUserCanSee").mockResolvedValue(mockFunds);
    const mockRetrieveCompanyByID = jest.spyOn(database, "retrieveCompanyByID").mockResolvedValue(mockCompany);

    const returnedValue = await PeopleController.userSeesCompany(mockUserID, mockCompanyID);

    expect(mockGetFundsUserCanSee).toBeCalledWith(mockUserID);
    expect(mockRetrieveCompanyByID).toBeCalledWith(mockCompanyID);
    expect(returnedValue).toBe(true);
  });

  it("should return false if user does not see the fund of the company", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockFundID = 3243;
    const mockCompany = { FundID: mockFundID };
    const mockFunds = ["5342", "54321", "", "12345"];

    const mockGetFundsUserCanSee = jest.spyOn(database, "getFundsUserCanSee").mockResolvedValue(mockFunds);
    const mockRetrieveCompanyByID = jest.spyOn(database, "retrieveCompanyByID").mockResolvedValue(mockCompany);

    const returnedValue = await PeopleController.userSeesCompany(mockUserID, mockCompanyID);

    expect(mockGetFundsUserCanSee).toBeCalledWith(mockUserID);
    expect(mockRetrieveCompanyByID).toBeCalledWith(mockCompanyID);
    expect(returnedValue).toBe(false);
  });
});
