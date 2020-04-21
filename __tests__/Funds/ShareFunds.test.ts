require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import FundsController from "../../FundsController";

describe("shareFund", () => {
  it("should call database.sharefund", async () => {
    const mockFundID = 1;
    const mockUserID = 3;
    const mockUser = { id: mockUserID };
    const mockReq = { body: { fundId: mockFundID, user: mockUser } };
    const mockSend = jest.fn();
    const mockRes = { sendStatus: mockSend };
    const mockShare = jest.spyOn(database, "sharefund");
    await FundsController.shareFund(mockReq, mockRes);
    expect(mockShare).toBeCalledWith(mockFundID, mockUserID);
    expect(mockSend).toBeCalledWith(200);
  });
});
describe("getUsersSharedWith", () => {
  it("should return 401 if the user is not authorized", async () => {
    const mockReq = { params: { id: 1 }, user: { UserID: 2 } };
    const mockSend = jest.fn();
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus, send: mockSend };

    const mockSightCheck = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(false);

    await FundsController.getUsersSharedWith(mockReq, mockRes);

    expect(mockSightCheck).toBeCalledWith(2, 1);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should send a list of users", async () => {
    const mockReq = { params: { id: 1 }, user: { UserID: 2 } };
    const mockSend = jest.fn();
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus, send: mockSend };
    const mockList = [{ Username: "a" }, { Username: "b" }, { Username: "c" }];
    const expectedResponse = { users: [{ username: "a" }, { username: "b" }, { username: "c" }] };

    const mockSightCheck = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(true);
    const mockGetUsers = jest.spyOn(database, "getSharedWithUsers").mockResolvedValue(mockList);

    await FundsController.getUsersSharedWith(mockReq, mockRes);

    expect(mockSightCheck).toBeCalledWith(2, 1);
    expect(mockGetUsers).toBeCalledWith(1);
    expect(mockSend).toBeCalledWith(expectedResponse);
  });
});
