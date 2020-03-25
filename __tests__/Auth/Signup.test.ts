import * as supertest from "supertest";
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

    jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(false);
    jest.spyOn(BackendProcessing.prototype, "passwordIsValid").mockReturnValue(true);

    AuthController.signup(mockReq, mockRes);

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];
    expect(mockedBackendProcessingInstance.emailIsValid).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.emailIsValid).toBeCalledWith(mockEmail);

    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(406);
  });

  // it("should return 406 if password is invalid", async () => {
  //   const mockEmail = "mock@test.com";
  //   const mockPassword = "1234567";
  //   const mockUsername = "TestUser";

  //   jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(true);
  //   jest.spyOn(BackendProcessing.prototype, "passwordIsValid").mockReturnValue(false);

  //   const response = await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

  //   const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

  //   expect(response.status).toBe(406);

  //   expect(mockedBackendProcessingInstance.passwordIsValid).toBeCalledTimes(1);
  //   expect(mockedBackendProcessingInstance.passwordIsValid).toBeCalledWith(mockPassword);
  // });

  // it("should return 409 if email is taken", async () => {
  //   const mockEmail = "mock@test.com";
  //   const mockPassword = "1234567";
  //   const mockUsername = "TestUser";

  //   jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(true);
  //   jest.spyOn(BackendProcessing.prototype, "passwordIsValid").mockReturnValue(true);

  //   jest.spyOn(BackendProcessing.prototype, "emailIsTaken").mockResolvedValue(true);

  //   const response = await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

  //   const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

  //   expect(response.status).toBe(409);

  //   expect(mockedBackendProcessingInstance.emailIsTaken).toBeCalledTimes(1);
  //   expect(mockedBackendProcessingInstance.emailIsTaken).toBeCalledWith(mockEmail);
  // });

  // it("should return 409 if username is taken", async () => {
  //   const mockEmail = "mock@test.com";
  //   const mockPassword = "1234567";
  //   const mockUsername = "TestUser";

  //   jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(true);
  //   jest.spyOn(BackendProcessing.prototype, "passwordIsValid").mockReturnValue(true);
  //   jest.spyOn(BackendProcessing.prototype, "emailIsTaken").mockResolvedValue(false);

  //   jest.spyOn(BackendProcessing.prototype, "usernameIsTaken").mockResolvedValue(true);

  //   const response = await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

  //   const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

  //   expect(response.status).toBe(409);

  //   expect(mockedBackendProcessingInstance.usernameIsTaken).toBeCalledTimes(1);
  //   expect(mockedBackendProcessingInstance.usernameIsTaken).toBeCalledWith(mockUsername);
  // });

  // it("should insert user and return 200 if credentials are satisfactory", async () => {
  //   const mockEmail = "mock@test.com";
  //   const mockPassword = "1234567";
  //   const mockUsername = "TestUser";

  //   jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(true);
  //   jest.spyOn(BackendProcessing.prototype, "passwordIsValid").mockReturnValue(true);
  //   jest.spyOn(BackendProcessing.prototype, "emailIsTaken").mockResolvedValue(false);
  //   jest.spyOn(BackendProcessing.prototype, "usernameIsTaken").mockResolvedValue(false);

  //   jest.spyOn(BackendProcessing.prototype, "insertUser").mockResolvedValue();

  //   const response = await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

  //   const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

  //   expect(response.status).toBe(200);

  //   expect(mockedBackendProcessingInstance.insertUser).toBeCalledTimes(1);
  //   expect(mockedBackendProcessingInstance.insertUser).toBeCalledWith(mockEmail, mockUsername, mockPassword);
  // });
});
