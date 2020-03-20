require("mysql2/node_modules/iconv-lite").encodingExists("foo");
jest.mock("../backend-processing");
import { app } from "../app";
import BackendProcessing from "../backend-processing";
import * as supertest from "supertest";

describe("Authentication", () => {
  const mockedBackendProcessing = BackendProcessing as jest.Mock<BackendProcessing>;
  const request = supertest(app);

  // beforeEach(() => {
  //   mockedBackendProcessing.mockClear();
  // });

  it("should check that credentials are not taken before inserting user in Signup", async () => {
    const mockEmail = "mock@test.com";
    const mockPassword = "12345678";
    const mockUsername = "TestUser";
    await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

    expect(mockedBackendProcessingInstance.emailIsTaken).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.emailIsTaken).toBeCalledWith(mockEmail);

    expect(mockedBackendProcessingInstance.usernameIsTaken).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.usernameIsTaken).toBeCalledWith(mockUsername);
  });
});
