jest.mock("../../../backend-processing");
jest.mock("../../../sequelizeDatabase/sequelFunctions");
jest.mock("bcryptjs");
import AuthController from "../../../AuthController";

describe("emailIsValid", () => {
  it("should accept emails in the form of something@something.com", () => {
    const testEmail = "something@something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should accept emails in the form of some.thing@something.com", () => {
    const testEmail = "some.thing@something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should accept emails in the form of something@some.thing.com", () => {
    const testEmail = "something@some.thing.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should accept emails in the form of something@something.something", () => {
    const testEmail = "something@something.something";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should reject emails in the form of something@something", () => {
    const testEmail = "something@something";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });

  it("should reject emails in the form of @something.com", () => {
    const testEmail = "@something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });

  it("should reject emails in the form of something.com", () => {
    const testEmail = "something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });

  it("should reject empty emails", () => {
    const testEmail = "";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });

  it("should reject undefined", () => {
    const testEmail = undefined;
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });
});

describe("passwordIsValid", () => {
  it("should accept passwords longer than 6 characters", () => {
    const testPassword = "1234567";
    expect(AuthController.passwordIsValid(testPassword)).toBe(true);
  });

  it("should accept passwords of length 6 characters", () => {
    const testPassword = "123456";
    expect(AuthController.passwordIsValid(testPassword)).toBe(true);
  });

  it("should reject passwords shorter than 6 characters", () => {
    const testPassword = "12345";
    expect(AuthController.passwordIsValid(testPassword)).toBe(false);
  });

  it("should reject undefined", () => {
    const testPassword = undefined;
    expect(AuthController.passwordIsValid(testPassword)).toBe(false);
  });

  describe("usernameIsTaken", () => {
    const database = require("../../../sequelizeDatabase/sequelFunctions");
    it("should call database.getUserByUsername", async () => {
      const mockGetUserByUsername = jest.fn();
      database.getUserByUsername = mockGetUserByUsername;

      const mockUsername = "TestUser";
      await AuthController.usernameIsTaken(mockUsername);

      expect(mockGetUserByUsername).toBeCalledTimes(1);
      expect(mockGetUserByUsername).toBeCalledWith(mockUsername);
    });

    it("should return false if database return null", async () => {
      const mockGetUserByUsername = jest.fn().mockResolvedValue(null);
      database.getUserByUsername = mockGetUserByUsername;

      const mockUsername = "TestUser";
      expect(await AuthController.usernameIsTaken(mockUsername)).toBe(false);
    });

    it("should return true if database return a user object", async () => {
      const mockUsername = "TestUser";
      const mockGetUserByUsername = jest.fn().mockResolvedValue({ username: mockUsername });
      database.getUserByUsername = mockGetUserByUsername;

      expect(await AuthController.usernameIsTaken(mockUsername)).toBe(true);
    });
  });
});
