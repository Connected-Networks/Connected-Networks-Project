require("mysql2/node_modules/iconv-lite").encodingExists("foo");
import { app } from "../app";
jest.mock("../backend-processing");
import BackendProcessing from "../backend-processing";
import * as supertest from "supertest";

describe("Signup", () => {
  const mockedBackendProcessing = BackendProcessing as jest.Mock<BackendProcessing>;
  const request = supertest(app);

  it("should return 406 if email is invalid", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";

    jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(false);
    jest.spyOn(BackendProcessing.prototype, "passwordIsValid").mockReturnValue(true);

    const response = await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

    expect(response.status).toBe(406);

    expect(mockedBackendProcessingInstance.emailIsValid).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.emailIsValid).toBeCalledWith(mockEmail);
  });

  it("should return 406 if password is invalid", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";

    jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(true);
    jest.spyOn(BackendProcessing.prototype, "passwordIsValid").mockReturnValue(false);

    const response = await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

    expect(response.status).toBe(406);

    expect(mockedBackendProcessingInstance.passwordIsValid).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.passwordIsValid).toBeCalledWith(mockEmail);
  });
});
