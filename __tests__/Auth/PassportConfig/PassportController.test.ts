jest.mock("../../../sequelizeDatabase/sequelFunctions");
const database = require("../../../sequelizeDatabase/sequelFunctions");
jest.mock("bcryptjs");
const bcrypt = require("bcryptjs");
import PassportController from "../../../config/PassportController";

describe("localStrategy", () => {
  it("should call done() with null, false and an error message if no user found in the database", async () => {
    database.getUserByUsername = jest.fn().mockResolvedValue(null);

    const mockDone = jest.fn();
    const mockUsername = "TestUser";
    const mockPassword = "1234567";
    await PassportController.localStrategy(mockUsername, mockPassword, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    const doneArgs = mockDone.mock.calls[0];
    expect(doneArgs[0]).toBe(null);
    expect(doneArgs[1]).toBe(false);
    const messageObject = doneArgs[2];
    expect(messageObject).toHaveProperty("message", expect.any(String));
  });

  it("should call done() with null, false and an error message if the password does not match", async () => {
    const mockHashedPassword = "7654321";
    database.getUserByUsername = jest.fn().mockResolvedValue({ Username: "TestUser", Password: mockHashedPassword });

    bcrypt.compareSync = jest.fn().mockResolvedValue(false);

    const mockDone = jest.fn();
    const mockUsername = "TestUser";
    const mockPassword = "1234567";
    await PassportController.localStrategy(mockUsername, mockPassword, mockDone);

    expect(bcrypt.compareSync).toBeCalledTimes(1);
    expect(bcrypt.compareSync).toBeCalledWith(mockPassword, mockHashedPassword);

    expect(mockDone).toBeCalledTimes(1);
    const doneArgs = mockDone.mock.calls[0];
    expect(doneArgs[0]).toBe(null);
    expect(doneArgs[1]).toBe(false);
    const messageObject = doneArgs[2];
    expect(messageObject).toHaveProperty("message", expect.any(String));
  });

  it("should call done() with null and the user object if the user was found and password matches", async () => {
    const mockUser = { Username: "TestUser", Password: "1234567" };
    database.getUserByUsername = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compareSync = jest.fn().mockResolvedValue(true);

    const mockDone = jest.fn();
    const mockUsername = "TestUser";
    const mockPassword = "1234567";
    await PassportController.localStrategy(mockUsername, mockPassword, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    expect(mockDone).toBeCalledWith(null, mockUser);
  });

  it("should call done() with an error if database throws an error", async () => {
    const mockError = new Error("mock error");
    database.getUserByUsername = jest.fn(() => {
      throw mockError;
    });

    const mockDone = jest.fn();
    const mockUsername = "TestUser";
    const mockPassword = "1234567";
    await PassportController.localStrategy(mockUsername, mockPassword, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    expect(mockDone).toBeCalledWith(mockError);
  });

  it("should call done() with an error if bcrypt throws an error", async () => {
    const mockUser = { Username: "TestUser", Password: "1234567" };
    database.getUserByUsername = jest.fn().mockResolvedValue(mockUser);
    const mockError = new Error("mock error");
    bcrypt.compareSync = jest.fn(() => {
      throw mockError;
    });

    const mockDone = jest.fn();
    const mockUsername = "TestUser";
    const mockPassword = "1234567";
    await PassportController.localStrategy(mockUsername, mockPassword, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    expect(mockDone).toBeCalledWith(mockError);
  });
});

describe("serializeUser", () => {
  it("should call done() with null and an object with the user's id", async () => {
    const mockUserID = "432";
    const mockUser = { UserID: mockUserID };
    const mockDone = jest.fn();

    PassportController.serializeUser(mockUser, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    const doneArgs = mockDone.mock.calls[0];
    expect(doneArgs[0]).toBe(null);
    const idObject = doneArgs[1];
    expect(idObject).toHaveProperty("id", mockUserID);
  });
});

describe("deserializeUser", () => {
  it("should call done() with null and the user object", async () => {
    const mockFoundUser = { Username: "TestUser", Password: "1234567" };
    database.getUserById = jest.fn().mockResolvedValue(mockFoundUser);

    const mockDone = jest.fn();
    const mockUser = { id: "1234" };
    await PassportController.deserializeUser(mockUser, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    expect(mockDone).toBeCalledWith(null, mockFoundUser);
  });
  it("should call done() with an error if user not found", async () => {
    database.getUserById = jest.fn().mockResolvedValue(null);

    const mockDone = jest.fn();
    const mockUser = { id: "1234" };
    await PassportController.deserializeUser(mockUser, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    expect(mockDone).toBeCalledWith(expect.any(Error));
  });

  it("should call done() with an error if database threw an error", async () => {
    const mockError = new Error("mock error");
    database.getUserById = jest.fn(() => {
      throw mockError;
    });

    const mockDone = jest.fn();
    const mockUser = { id: "1234" };
    await PassportController.deserializeUser(mockUser, mockDone);

    expect(mockDone).toBeCalledTimes(1);
    expect(mockDone).toBeCalledWith(mockError);
  });
});
