require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import CompaniesController from "../../CompaniesController";

describe("GetCompanies", () => {
  it("should respond with companies got from database", async () => {
    const mockUserID = 12345;
    const mockReq = { user: { UserID: mockUserID } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };
    const mockCompanies = [{ id: 123, fundID: 1, name: "Mock" }];

    const mockGetCompaniesFromDatabase = jest
      .spyOn(CompaniesController, "getCompaniesFromDatabase")
      .mockResolvedValue(mockCompanies);

    await CompaniesController.getCompanies(mockReq, mockRes);

    expect(mockGetCompaniesFromDatabase).toBeCalledWith(mockUserID);
    expect(mockSend).toBeCalledWith({ data: mockCompanies });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockReq = { user: { UserID: mockUserID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockGetCompaniesFromDatabase = jest
      .spyOn(CompaniesController, "getCompaniesFromDatabase")
      .mockRejectedValue(new Error("Mock error"));

    await CompaniesController.getCompanies(mockReq, mockRes);

    expect(mockGetCompaniesFromDatabase).toBeCalledWith(mockUserID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});

describe("GetCompaniesFromDatabase", () => {
  it("should get companies from database, map them to DisplayCompany and then return", async () => {
    const mockUserID = 12345;
    const mockCompanies = [
      {
        CompanyID: 123,
        FundID: 1,
        CompanyName: "Mock",
      },
      {
        CompanyID: 321,
        FundID: 4,
        CompanyName: "Mock2",
      },
    ];

    const mockGetAllCompaniesOfUser = jest.spyOn(database, "getAllCompaniesOfUser").mockResolvedValue(mockCompanies);

    const returnedCompanies = await CompaniesController.getCompaniesFromDatabase(mockUserID);

    expect(mockGetAllCompaniesOfUser).toBeCalledWith(mockUserID);

    const expectedCompanies = [
      { id: 123, fundID: 1, name: "Mock" },
      { id: 321, fundID: 4, name: "Mock2" },
    ];
    expect(returnedCompanies).toEqual(expectedCompanies);
  });
});
