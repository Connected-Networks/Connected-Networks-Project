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
