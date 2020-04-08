require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../PeopleController";
import FundsController from "../../FundsController";

describe("DeleteFund", () => {
  it("should respond with 401 if user is not authorized to change the fund", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockFundID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    console.error = jest.fn();

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(false);

    await FundsController.deleteFund(mockReq, mockRes);

    expect(mockUserCanChangeFund).toBeCalledWith(mockUserID, mockFundID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should delete the fund in database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockFundID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);
    console.error = jest.fn();

    const mockDeleteFund = jest.spyOn(database, "deleteFund").mockResolvedValue(null);

    await FundsController.deleteFund(mockReq, mockRes);

    expect(mockDeleteFund).toBeCalledWith(mockFundID);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockFundID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);
    console.error = jest.fn();

    const mockDeleteFund = jest.spyOn(database, "deleteFund").mockRejectedValue(new Error("Mock error"));

    await FundsController.deleteFund(mockReq, mockRes);

    expect(mockDeleteFund).toBeCalledWith(mockFundID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
