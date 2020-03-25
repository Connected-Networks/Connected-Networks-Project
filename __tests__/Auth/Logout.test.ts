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
});
