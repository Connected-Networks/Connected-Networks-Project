require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
import AuthController from "../../AuthController";

describe("Logout", () => {
  it("should return 500 if user is not logged in", () => {
    const mockReq = {};
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.logout(mockReq, mockRes);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(500);
  });

  it("should destroy session and clear cookies", () => {
    const mockUsername = "TestUser";
    const mockDestroy = jest.fn(callback => callback());
    const mockReq = { user: { Username: mockUsername }, session: { destroy: mockDestroy } };

    const mockSendStatus = jest.fn();
    const mockClearCookie = jest.fn();
    const mockRes = { sendStatus: mockSendStatus, clearCookie: mockClearCookie };

    AuthController.logout(mockReq, mockRes);

    expect(mockDestroy).toBeCalledTimes(1);

    expect(mockClearCookie).toBeCalledTimes(1);
    expect(mockClearCookie).toBeCalledWith("connect.sid");

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(200);
  });
});
