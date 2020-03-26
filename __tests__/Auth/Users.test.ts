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
});
