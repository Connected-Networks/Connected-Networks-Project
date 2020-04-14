require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import HistoryController from "../../HistoryController";
import FundsController from "../../FundsController";

describe("GetHistory", () => {
  it("should respond with 401 if user is not authorized to see the individual", async () => {
    const mockUserID = 12345;
    const individualID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: individualID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    console.error = jest.fn();

    const mockUserCanSeeIndividual = jest.spyOn(HistoryController, "userCanSeeIndividual").mockResolvedValue(false);

    await HistoryController.getHistory(mockReq, mockRes);

    expect(mockUserCanSeeIndividual).toBeCalledWith(mockUserID, individualID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should respond with history got from database", async () => {
    const mockUserID = 12345;
    const individualID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: individualID } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };
    const mockHistory = [
      {
        id: 123,
        company: "MockCompany",
        position: "MockPosition",
        start: "Yesterday",
        end: "Tomorrow",
      },
    ];

    const mockUserCanSeeIndividual = jest.spyOn(HistoryController, "userCanSeeIndividual").mockResolvedValue(true);
    const mockGetHistoryFromDatabase = jest.spyOn(HistoryController, "getHistoryFromDatabase").mockResolvedValue(mockHistory);

    await HistoryController.getHistory(mockReq, mockRes);

    expect(mockGetHistoryFromDatabase).toBeCalledWith(individualID);
    expect(mockSend).toBeCalledWith({ data: mockHistory });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const individualID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: individualID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    console.error = jest.fn();

    const mockUserCanSeeIndividual = jest.spyOn(HistoryController, "userCanSeeIndividual").mockResolvedValue(true);
    const mockGetHistoryFromDatabase = jest
      .spyOn(HistoryController, "getHistoryFromDatabase")
      .mockRejectedValue(new Error("Mock error"));

    await HistoryController.getHistory(mockReq, mockRes);

    expect(mockGetHistoryFromDatabase).toBeCalledWith(individualID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});

describe("userCanSeeIndividual", () => {
  it("should return true if the user can see the individual's fund", async () => {
    const mockUserID = 12345;
    const mockIndividualID = 54321;
    const mockIndividual = { FundID: 123 };

    const mockRetrieveIndividualByID = jest.spyOn(database, "retrieveIndividualByID").mockResolvedValue(mockIndividual);
    const mockUserSeesFund = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(true);

    const returnedValue = await HistoryController.userCanSeeIndividual(mockUserID, mockIndividualID);

    expect(mockRetrieveIndividualByID).toBeCalledWith(mockIndividualID);
    expect(mockUserSeesFund).toBeCalledWith(mockUserID, mockIndividual.FundID);
    expect(returnedValue).toBe(true);
  });

  it("should return false if the user can not see the individual's fund", async () => {
    const mockUserID = 12345;
    const mockIndividualID = 54321;
    const mockIndividual = { FundID: 123 };

    const mockRetrieveIndividualByID = jest.spyOn(database, "retrieveIndividualByID").mockResolvedValue(mockIndividual);
    const mockUserSeesFund = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(false);

    const returnedValue = await HistoryController.userCanSeeIndividual(mockUserID, mockIndividualID);

    expect(mockRetrieveIndividualByID).toBeCalledWith(mockIndividualID);
    expect(mockUserSeesFund).toBeCalledWith(mockUserID, mockIndividual.FundID);
    expect(returnedValue).toBe(false);
  });
});
