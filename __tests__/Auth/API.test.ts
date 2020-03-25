import * as supertest from "supertest";
jest.mock("../../AuthController");
import AuthController from "../../AuthController";
import { app } from "../../app";

const request = supertest(app);

describe("API", () => {
  it("should call AuthController.signup for ./signup", async () => {
    const mockSignup = jest.spyOn(AuthController, "signup").mockImplementation(async (req, res) => res.sendStatus(200));

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
});
