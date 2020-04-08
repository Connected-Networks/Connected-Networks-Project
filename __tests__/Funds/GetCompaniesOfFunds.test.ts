require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import FundsController from "../../FundsController";

describe("GetCompaniesOfFunds", () => {
  it("should respond with 401 if user is not authorized to see the fund", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockFundID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    console.error = jest.fn();

    const mockUserSeesFund = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(false);

    await FundsController.getCompaniesOfFund(mockReq, mockRes);

    expect(mockUserSeesFund).toBeCalledWith(mockUserID, mockFundID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should respond with companies got from database", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockFundID } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };
    const mockCompanies = [
      { id: 123, fundID: 1, name: "Mock" },
      { id: 321, fundID: 4, name: "Mock2" },
    ];

    const mockUserSeesFund = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(true);
    const mockGetCompaniesFromFund = jest.spyOn(FundsController, "getCompaniesFromFund").mockResolvedValue(mockCompanies);

    await FundsController.getCompaniesOfFund(mockReq, mockRes);

    expect(mockGetCompaniesFromFund).toBeCalledWith(mockFundID);
    expect(mockSend).toBeCalledWith({ data: mockCompanies });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockFundID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserSeesFund = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(true);
    const mockGetCompaniesFromFund = jest
      .spyOn(FundsController, "getCompaniesFromFund")
      .mockRejectedValue(new Error("Mock error"));

    await FundsController.getCompaniesOfFund(mockReq, mockRes);

    expect(mockGetCompaniesFromFund).toBeCalledWith(mockFundID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});

describe("userSeesFund", () => {
  it("should return true if the given fundID is in the funds user can see", async () => {
    const mockUserID = 12345;
    const mockFundID = 3243;
    const mockFunds = ["5342", "3243", "54321", "", "12345"];

    const mockGetFundsUserCanSee = jest.spyOn(database, "getFundsUserCanSee").mockResolvedValue(mockFunds);

    const returnedValue = await FundsController.userSeesFund(mockUserID, mockFundID);

    expect(mockGetFundsUserCanSee).toBeCalledWith(mockUserID);
    expect(returnedValue).toBe(true);
  });

  it("should return false if the given fundID is not in the funds user can see", async () => {
    const mockUserID = 12345;
    const mockFundID = 3243;
    const mockFunds = ["5342", "54321", "", "12345"];

    const mockGetFundsUserCanSee = jest.spyOn(database, "getFundsUserCanSee").mockResolvedValue(mockFunds);

    const returnedValue = await FundsController.userSeesFund(mockUserID, mockFundID);

    expect(mockGetFundsUserCanSee).toBeCalledWith(mockUserID);
    expect(returnedValue).toBe(false);
  });
});

describe("GetCompaniesFromFund", () => {
  it("should get companies from database, map them to DisplayCompany and then return", async () => {
    const mockFundID = 12345;
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

    const mockRetrieveCompaniesByFunds = jest.spyOn(database, "retrieveCompaniesByFunds").mockResolvedValue(mockCompanies);

    const returnedCompanies = await FundsController.getCompaniesFromFund(mockFundID);

    expect(mockRetrieveCompaniesByFunds).toBeCalledWith(mockFundID);

    const expectedCompanies = [
      { id: 123, fundID: 1, name: "Mock" },
      { id: 321, fundID: 4, name: "Mock2" },
    ];
    expect(returnedCompanies).toEqual(expectedCompanies);
  });
});
