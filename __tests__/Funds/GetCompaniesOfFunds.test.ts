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
    const mockRetrieveCompaniesFromFund = jest
      .spyOn(FundsController, "retrieveCompaniesFromFund")
      .mockResolvedValue(mockCompanies);

    await FundsController.getCompaniesOfFund(mockReq, mockRes);

    expect(mockRetrieveCompaniesFromFund).toBeCalledWith(mockFundID);
    expect(mockSend).toBeCalledWith({ data: mockCompanies });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockFundID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserSeesFund = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(true);
    const mockRetrieveCompaniesFromFund = jest
      .spyOn(FundsController, "retrieveCompaniesFromFund")
      .mockRejectedValue(new Error("Mock error"));

    await FundsController.getCompaniesOfFund(mockReq, mockRes);

    expect(mockRetrieveCompaniesFromFund).toBeCalledWith(mockFundID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
