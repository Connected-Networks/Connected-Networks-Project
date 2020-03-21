require("mysql2/node_modules/iconv-lite").encodingExists("foo");
import { app } from "../app";
jest.mock("../backend-processing");
import BackendProcessing from "../backend-processing";
import * as supertest from "supertest";

describe("Signup", () => {
  const mockedBackendProcessing = BackendProcessing as jest.Mock<BackendProcessing>;
  const request = supertest(app);

  it("should return 406 if email is invalid", async () => {
    const mockEmail = "";
    const mockPassword = "";
    const mockUsername = "";

    jest.spyOn(BackendProcessing.prototype, "emailIsValid").mockReturnValue(false);

    const response = await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

    const mockedBackendProcessingInstance = mockedBackendProcessing.mock.instances[0];

    expect(response.status).toBe(406);

    expect(mockedBackendProcessingInstance.emailIsValid).toBeCalledTimes(1);
    expect(mockedBackendProcessingInstance.emailIsValid).toBeCalledWith(mockEmail);
  });
});
