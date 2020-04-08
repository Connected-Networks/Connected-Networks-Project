require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import FundsController from "../../FundsController";

describe("AddFund", () => {
  it("should add the fund to database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockFund = { name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockFund } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockInsertFund = jest.spyOn(database, "insertFund").mockResolvedValue(null);

    await FundsController.addFund(mockReq, mockRes);

    expect(mockInsertFund).toBeCalledWith(mockFund.name);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockFund = { name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockFund } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockInsertFund = jest.spyOn(database, "insertFund").mockRejectedValue(new Error("Mock error"));

    await FundsController.addFund(mockReq, mockRes);

    expect(mockInsertFund).toBeCalledWith(mockFund.name);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
