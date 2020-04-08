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

  static testApiUsedFunction(CrudType: CrudType, endPoint: string, functionUsed: Function) {
    jest.mock("express");
    const express = require("express");
    express.Router = jest.fn().mockReturnValue(this.mockExpressRouter);

    jest.isolateModules(() => {
      require("./router");
    });

    expect(this.typesToMethods.get(CrudType)).toBeCalledWith(endPoint, functionUsed);
  }
}
