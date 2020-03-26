jest.mock("../../backend-processing"); //You need to mock before importing BackendProcessing since it runs some code on import
import BackendProcessing from "../../backend-processing";
import AuthController from "../../AuthController";

const mockedBackendProcessing = BackendProcessing as jest.Mock<BackendProcessing>;

describe("Signup", () => {
  it("should return 406 if email is invalid", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    const mockReq = { body: { email: mockEmail, username: mockUsername, password: mockPassword } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockEmailIsValid = jest.spyOn(AuthController, "emailIsValid").mockReturnValue(false);
    const mockPasswordIsValid = jest.spyOn(AuthController, "passwordIsValid").mockReturnValue(true);

    await AuthController.signup(mockReq, mockRes);

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];
    expect(mockEmailIsValid).toBeCalledTimes(1);
    expect(mockEmailIsValid).toBeCalledWith(mockEmail);

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

    const mockEmailIsValid = jest.spyOn(AuthController, "emailIsValid").mockReturnValue(true);
    const mockPasswordIsValid = jest.spyOn(AuthController, "passwordIsValid").mockReturnValue(false);

    await AuthController.signup(mockReq, mockRes);

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];
    expect(mockPasswordIsValid).toBeCalledTimes(1);
    expect(mockPasswordIsValid).toBeCalledWith(mockPassword);

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

    jest.spyOn(AuthController, "emailIsValid").mockReturnValue(true);
    jest.spyOn(AuthController, "passwordIsValid").mockReturnValue(true);

    jest.spyOn(BackendProcessing.prototype, "emailIsTaken").mockResolvedValue(true);

    await AuthController.signup(mockReq, mockRes);

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];
    expect(mockedBackendProcessingInstance.emailIsTaken).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.emailIsTaken).toBeCalledWith(mockEmail);

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

    jest.spyOn(AuthController, "emailIsValid").mockReturnValue(true);
    jest.spyOn(AuthController, "passwordIsValid").mockReturnValue(true);
    jest.spyOn(BackendProcessing.prototype, "emailIsTaken").mockResolvedValue(false);

    jest.spyOn(BackendProcessing.prototype, "usernameIsTaken").mockResolvedValue(true);

    await AuthController.signup(mockReq, mockRes);

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];
    expect(mockedBackendProcessingInstance.usernameIsTaken).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.usernameIsTaken).toBeCalledWith(mockUsername);

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

    jest.spyOn(AuthController, "emailIsValid").mockReturnValue(true);
    jest.spyOn(AuthController, "passwordIsValid").mockReturnValue(true);
    jest.spyOn(BackendProcessing.prototype, "emailIsTaken").mockResolvedValue(false);
    jest.spyOn(BackendProcessing.prototype, "usernameIsTaken").mockResolvedValue(false);

    jest.spyOn(BackendProcessing.prototype, "insertUser").mockResolvedValue();

    await AuthController.signup(mockReq, mockRes);

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];
    expect(mockedBackendProcessingInstance.insertUser).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.insertUser).toBeCalledWith(mockEmail, mockUsername, mockPassword);

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

    jest.spyOn(AuthController, "emailIsValid").mockReturnValue(true);
    jest.spyOn(AuthController, "passwordIsValid").mockReturnValue(true);
    jest.spyOn(BackendProcessing.prototype, "emailIsTaken").mockResolvedValue(false);
    jest.spyOn(BackendProcessing.prototype, "usernameIsTaken").mockResolvedValue(false);

    jest.spyOn(BackendProcessing.prototype, "insertUser").mockImplementation(() => Promise.reject(new Error("Mock error")));
    console.log = jest.fn();

    await AuthController.signup(mockReq, mockRes);

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];
    expect(mockedBackendProcessingInstance.insertUser).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.insertUser).toBeCalledWith(mockEmail, mockUsername, mockPassword);

    expect(console.log).toHaveBeenCalled();

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
