import AuthController from "../../AuthController";

describe("Login", () => {
  it("should return username if login was successful", () => {
    const mockUsername = "TestUser";
    const mockReq = { user: { Username: mockUsername } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };

    AuthController.handleLoginSuccess(mockReq, mockRes);

    expect(mockSend).toBeCalledTimes(1);
    expect(mockSend).toBeCalledWith({ username: mockUsername });
  });
});
