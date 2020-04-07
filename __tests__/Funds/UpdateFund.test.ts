require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../PeopleController";
import FundsController from "../../FundsController";

describe("UpdateFund", () => {
  it("should respond with 401 if user is not authorized to change the fund", async () => {
    const mockUserID = 12345;
    const mockFund = { id: 123, name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockFund } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(false);
    console.error = jest.fn();

    await FundsController.updateFund(mockReq, mockRes);

    expect(mockUserCanChangeFund).toBeCalledWith(mockUserID, mockFund.id);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should update the fund in database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockFund = { id: 123, name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockFund } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockModifyFund = jest.spyOn(database, "modifyFund").mockResolvedValue(null);

    await FundsController.updateFund(mockReq, mockRes);

    expect(mockModifyFund).toBeCalledWith(mockFund.id, mockFund.name);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockFund = { id: 123, name: "Mock" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockFund } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockModifyFund = jest.spyOn(database, "modifyFund").mockRejectedValue(new Error("Mock error"));

    await FundsController.updateFund(mockReq, mockRes);

    expect(mockModifyFund).toBeCalledWith(mockFund.id, mockFund.name);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
