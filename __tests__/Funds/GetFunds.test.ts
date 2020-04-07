require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import FundsController from "../../FundsController";

describe("GetFunds", () => {
  it("should respond with funds got from database", async () => {
    const mockUserID = 12345;
    const mockReq = { user: { UserID: mockUserID } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };
    const mockFunds = [{ id: 123, name: "Mock" }];

    const mockGetFundsFromDatabase = jest.spyOn(FundsController, "getFundsFromDatabase").mockResolvedValue(mockFunds);

    await FundsController.getFunds(mockReq, mockRes);

    expect(mockGetFundsFromDatabase).toBeCalledWith(mockUserID);
    expect(mockSend).toBeCalledWith({ data: mockFunds });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockReq = { user: { UserID: mockUserID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockGetFundsFromDatabase = jest
      .spyOn(FundsController, "getFundsFromDatabase")
      .mockRejectedValue(new Error("Mock error"));

    await FundsController.getFunds(mockReq, mockRes);

    expect(mockGetFundsFromDatabase).toBeCalledWith(mockUserID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});

describe("GetFundsFromDatabase", () => {
  it("should only return funds user can see and should return as DisplayFunds", async () => {
    const mockUserID = 12345;
    const mockFundsUserCanSee = ["321"];
    const mockAllFunds = [
      {
        FundID: 123,
        FundName: "Mock",
      },
      {
        FundID: 321,
        FundName: "Mock2",
      },
    ];

    const mockGetAllFunds = jest.spyOn(database, "getAllFunds").mockResolvedValue(mockAllFunds);
    const mockGetFundsUserCanSee = jest.spyOn(database, "getFundsUserCanSee").mockResolvedValue(mockFundsUserCanSee);

    const returnedFunds = await FundsController.getFundsFromDatabase(mockUserID);

    expect(mockGetAllFunds).toBeCalledTimes(1);
    expect(mockGetFundsUserCanSee).toBeCalledWith(mockUserID);

    const expectedFunds = [{ id: 321, name: "Mock2" }];
    expect(returnedFunds).toEqual(expectedFunds);
  });
});
