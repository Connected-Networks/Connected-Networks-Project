require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

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

describe("emailIsTaken", () => {
  const database = require("../../../sequelizeDatabase/sequelFunctions");
  it("should call database.emailIsTaken", async () => {
    database.getUserByEmail = jest.fn();

    const mockEmail = "TestUser";
    await AuthController.emailIsTaken(mockEmail);

    expect(database.getUserByEmail).toBeCalledTimes(1);
    expect(database.getUserByEmail).toBeCalledWith(mockEmail);
  });

  it("should return false if database return null", async () => {
    database.getUserByEmail = jest.fn().mockResolvedValue(null);

    const mockEmail = "TestUser";
    expect(await AuthController.emailIsTaken(mockEmail)).toBe(false);
  });

  it("should return true if database return a user object", async () => {
    const mockEmail = "TestUser";
    database.getUserByEmail = jest.fn().mockResolvedValue({ email: mockEmail });

    expect(await AuthController.emailIsTaken(mockEmail)).toBe(true);
  });
});

describe("insertUser", () => {
  const bcrypt = require("bcryptjs");
  it("should hash password", async () => {
    bcrypt.hashSync = jest.fn();

    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    await AuthController.insertUser(mockEmail, mockUsername, mockPassword);

    expect(bcrypt.hashSync).toBeCalledTimes(1);
    const passedPassword = bcrypt.hashSync.mock.calls[0][0];
    expect(passedPassword).toBe(mockPassword);
  });

  it("should call database.insertUser", async () => {
    const database = require("../../../sequelizeDatabase/sequelFunctions");

    const mockHashedPassword = "HashedPassword";
    bcrypt.hashSync = jest.fn().mockImplementation((password: string) => mockHashedPassword);

    database.insertUser = jest.fn();

    const mockEmail = "mock@test.com";
    const mockPassword = "1234567";
    const mockUsername = "TestUser";
    await AuthController.insertUser(mockEmail, mockUsername, mockPassword);

    expect(database.insertUser).toBeCalledTimes(1);
    expect(database.insertUser).toBeCalledWith(mockUsername, mockHashedPassword, mockEmail);
  });
});
