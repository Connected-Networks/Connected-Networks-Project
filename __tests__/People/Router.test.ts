require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../AuthController");
jest.mock("../../backend-processing");
jest.mock("../../config/passport");
jest.mock("express");
const express = require("express");
import PeopleController from "../../PeopleController";

describe("Router", () => {
  const mockExpressRouter = { post: jest.fn(), get: jest.fn(), put: jest.fn(), delete: jest.fn() };

  it("should use PeopleController.getPeople for get /people", async () => {
    express.Router = jest.fn().mockReturnValue(mockExpressRouter);

    importIsolatedRouter();

    expect(mockExpressRouter.get).toBeCalledWith("/people", PeopleController.getPeople);
  });

  function importIsolatedRouter() {
    jest.isolateModules(() => {
      require("../../router");
    });
  }
});
