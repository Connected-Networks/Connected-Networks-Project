jest.mock("../../AuthController");
import AuthController from "../../AuthController";
jest.mock("../../config/passport");
import Passport from "../../config/passport";
import * as supertest from "supertest";

describe("API", () => {
  it("should call AuthController.signup for ./signup", async () => {
    jest.spyOn(Passport, "authenticate").mockImplementation((type: string) => jest.fn()); //Not needed for testing just added so the code compiles

    const mockSignup = jest.spyOn(AuthController, "signup").mockImplementation(async (req, res) => res.sendStatus(200));

    let app;
    jest.isolateModules(() => {
      app = require("../../app").app;
    });
    const request = supertest(app);

    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    await request.post("/signup").send({ email: mockEmail, username: mockUsername, password: mockPassword });

    expect(mockSignup).toBeCalledTimes(1);

    const passedReq = mockSignup.mock.calls[0][0];
    expect(passedReq.body.email).toBe(mockEmail);
    expect(passedReq.body.password).toBe(mockPassword);
    expect(passedReq.body.username).toBe(mockUsername);
  });

  it("should use passport.authenticate as middleware for ./login", async () => {
    const mockAuthenticationProcess = jest.fn((req, res) => res.sendStatus(200));
    jest.spyOn(Passport, "authenticate").mockImplementation((type: string) => mockAuthenticationProcess);

    let app;
    jest.isolateModules(() => {
      app = require("../../app").app;
    });
    const request = supertest(app);

    const mockUsername = "TestUser";
    const mockPassword = "1234567";
    await request.post("/login").send({ username: mockUsername, password: mockPassword });

    expect(Passport.authenticate).toBeCalledTimes(1);
    expect(Passport.authenticate).toBeCalledWith("local");

    expect(mockAuthenticationProcess).toBeCalledTimes(1);
    const passedReq = mockAuthenticationProcess.mock.calls[0][0];
    expect(passedReq.body.username).toBe(mockUsername);
    expect(passedReq.body.password).toBe(mockPassword);
  });
});
