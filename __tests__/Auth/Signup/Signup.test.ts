require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../../sequelizeDatabase/sequelFunctions");
jest.mock("bcryptjs");
import AuthController from "../../../AuthController";

describe("Signup", () => {
  it("should return 406 if email is invalid", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    const mockReq = { body: { email: mockEmail, username: mockUsername, password: mockPassword } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.emailIsValid = jest.fn().mockReturnValue(false);
    AuthController.passwordIsValid = jest.fn().mockReturnValue(true);

    await AuthController.signup(mockReq, mockRes);

    expect(AuthController.emailIsValid).toBeCalledTimes(1);
    expect(AuthController.emailIsValid).toBeCalledWith(mockEmail);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(406);
  });

  it("should return 406 if password is invalid", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    const mockReq = { body: { email: mockEmail, username: mockUsername, password: mockPassword } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.emailIsValid = jest.fn().mockReturnValue(true);
    AuthController.passwordIsValid = jest.fn().mockReturnValue(false);

    await AuthController.signup(mockReq, mockRes);

    expect(AuthController.passwordIsValid).toBeCalledTimes(1);
    expect(AuthController.passwordIsValid).toBeCalledWith(mockPassword);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(406);
  });

  it("should return 409 if email is taken", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    const mockReq = { body: { email: mockEmail, username: mockUsername, password: mockPassword } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.emailIsValid = jest.fn().mockReturnValue(true);
    AuthController.passwordIsValid = jest.fn().mockReturnValue(true);

    AuthController.emailIsTaken = jest.fn().mockResolvedValue(true);

    await AuthController.signup(mockReq, mockRes);

    expect(AuthController.emailIsTaken).toBeCalledTimes(1);
    expect(AuthController.emailIsTaken).toBeCalledWith(mockEmail);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(409);
  });

  it("should return 409 if username is taken", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    const mockReq = { body: { email: mockEmail, username: mockUsername, password: mockPassword } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.emailIsValid = jest.fn().mockReturnValue(true);
    AuthController.passwordIsValid = jest.fn().mockReturnValue(true);
    AuthController.emailIsTaken = jest.fn().mockResolvedValue(false);

    AuthController.usernameIsTaken = jest.fn().mockResolvedValue(true);

    await AuthController.signup(mockReq, mockRes);

    expect(AuthController.usernameIsTaken).toBeCalledTimes(1);
    expect(AuthController.usernameIsTaken).toBeCalledWith(mockUsername);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(409);
  });

  it("should insert user and return 200 if credentials are satisfactory", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    const mockReq = { body: { email: mockEmail, username: mockUsername, password: mockPassword } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.emailIsValid = jest.fn().mockReturnValue(true);
    AuthController.passwordIsValid = jest.fn().mockReturnValue(true);
    AuthController.emailIsTaken = jest.fn().mockResolvedValue(false);
    AuthController.usernameIsTaken = jest.fn().mockResolvedValue(false);

    AuthController.insertUser = jest.fn().mockResolvedValue(undefined);

    await AuthController.signup(mockReq, mockRes);

    expect(AuthController.insertUser).toBeCalledTimes(1);
    expect(AuthController.insertUser).toBeCalledWith(mockEmail, mockUsername, mockPassword);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should return 500 if something went wrong while inserting user", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    const mockReq = { body: { email: mockEmail, username: mockUsername, password: mockPassword } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    AuthController.emailIsValid = jest.fn().mockReturnValue(true);
    AuthController.passwordIsValid = jest.fn().mockReturnValue(true);
    AuthController.emailIsTaken = jest.fn().mockResolvedValue(false);
    AuthController.usernameIsTaken = jest.fn().mockResolvedValue(false);

    AuthController.insertUser = jest.fn().mockImplementation(() => Promise.reject(new Error("Mock error")));

    console.log = jest.fn();

    await AuthController.signup(mockReq, mockRes);

    expect(AuthController.insertUser).toBeCalledTimes(1);
    expect(AuthController.insertUser).toBeCalledWith(mockEmail, mockUsername, mockPassword);

    expect(console.log).toHaveBeenCalled();

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(500);
  });

  //TODO: add tests for the cases where any of helper functions throw an error
});
