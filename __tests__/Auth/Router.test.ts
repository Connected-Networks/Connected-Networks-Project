require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
jest.mock("../../backend-processing");
jest.mock("../../config/passport");
import Passport from "../../config/passport";
jest.mock("express");
const express = require("express");
import AuthController from "../../AuthController";

describe("Router", () => {
  const mockExpressRouter = { post: jest.fn(), get: jest.fn(), put: jest.fn(), delete: jest.fn() };

  it("should use AuthController.signup for /signup", async () => {
    express.Router = jest.fn().mockReturnValue(mockExpressRouter);

    importIsolatedRouter();

    expect(mockExpressRouter.post).toBeCalledWith("/signup", AuthController.signup);
  });

  it("should use passport.authenticate for /login and AuthController.handleLoginSuccess as success callback", () => {
    express.Router = jest.fn().mockReturnValue(mockExpressRouter);

    const mockAuthenticationProcess = jest.fn();
    const mockAuthenticate = jest.fn().mockReturnValue(mockAuthenticationProcess);
    Passport.authenticate = mockAuthenticate;

    importIsolatedRouter();

    expect(mockExpressRouter.post).toBeCalledWith("/login", mockAuthenticationProcess, AuthController.handleLoginSuccess);
  });

  it("should use AuthController.logout for /logout", () => {
    express.Router = jest.fn().mockReturnValue(mockExpressRouter);

    importIsolatedRouter();

    expect(mockExpressRouter.post).toBeCalledWith("/logout", AuthController.logout);
  });

  it("should use AuthController.getCurrentUser for /user", () => {
    express.Router = jest.fn().mockReturnValue(mockExpressRouter);

    importIsolatedRouter();

    expect(mockExpressRouter.get).toBeCalledWith("/user", AuthController.getCurrentUser);
  });

  function importIsolatedRouter() {
    jest.isolateModules(() => {
      jest.mock("../../sequelizeDatabase/modelSetup");
      jest.mock("../../sequelizeDatabase/sequelFunctions");
      jest.mock("../../backend-processing");
      jest.mock("../../config/passport");
      require("../../router");
    });
  }
});
