jest.mock("./AuthController");
jest.mock("./backend-processing");
jest.mock("./config/passport");
jest.mock("express");
const express = require("express");

export enum CrudType {
  GET,
  POST,
  PUT,
  DELETE,
}

export default class RouterTestingUtils {
  private static mockExpressRouter = { post: jest.fn(), get: jest.fn(), put: jest.fn(), delete: jest.fn() };
  private static typesToMethods = new Map([
    [CrudType.GET, RouterTestingUtils.mockExpressRouter.get],
    [CrudType.POST, RouterTestingUtils.mockExpressRouter.post],
    [CrudType.PUT, RouterTestingUtils.mockExpressRouter.put],
    [CrudType.DELETE, RouterTestingUtils.mockExpressRouter.delete],
  ]);

  static testRouterAPI(CrudType: CrudType, endPoint: string, functionUsed: Function) {
    express.Router = jest.fn().mockReturnValue(this.mockExpressRouter);

    this.importIsolatedRouter();

    expect(this.typesToMethods.get(CrudType)).toBeCalledWith(endPoint, functionUsed);
  }

  private static importIsolatedRouter() {
    jest.isolateModules(() => {
      require("./router");
    });
  }
}
