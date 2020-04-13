require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
import AuthController from "../../AuthController";

describe("getCurrentUser", () => {
  it("should return 401 if user is not logged in", () => {
    const mockReq = {};
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.getCurrentUser(mockReq, mockRes);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should return username if user is logged in", () => {
    const mockUsername = "TestUser";
    const mockReq = { user: { Username: mockUsername } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };

    AuthController.getCurrentUser(mockReq, mockRes);

    expect(mockSend).toBeCalledTimes(1);
    expect(mockSend).toBeCalledWith({ username: mockUsername });
  });
});
