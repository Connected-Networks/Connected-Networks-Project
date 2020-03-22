import * as supertest from "supertest";
jest.mock("../../config/passport");
import Passport from "../../config/passport";

describe("Login", () => {
  it("should use the local passport configuration to authenticate", done => {
    const mockAuthenticationProcess = jest.fn().mockImplementation((req, res, next) => {
      req.user = { Username: req.body.username };
      next();
    });
    jest.spyOn(Passport, "authenticate").mockImplementation((type: string) => mockAuthenticationProcess);

    import("../../app").then(async appModule => {
      const { app } = appModule;
      const request = supertest(app);
      const mockUsername = "TestUser";
      const mockPassword = "1234567";

      const response = await request.post("/login").send({ username: mockUsername, password: mockPassword });

      expect(Passport.authenticate).toBeCalledTimes(1);
      expect(Passport.authenticate).toBeCalledWith("local");

      expect(mockAuthenticationProcess).toBeCalledTimes(1);

      expect(response.status).toBe(200);
      expect(response.body.username).toEqual(mockUsername);

      done();
    });
  });
});
