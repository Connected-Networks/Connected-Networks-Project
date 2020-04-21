require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import HistoryController from "../../HistoryController";
import FundsController from "../../FundsController";
import PeopleController from "../../PeopleController";

describe("addHistory", () => {
  it("should send 401 if user is not authorized to add history", async () => {
    const mockHistory = {};
    const mockUserID = 123;
    const mockIndividualID = 456;
    const mockIndividual = { id: mockIndividualID };
    const mockReq = { body: { newData: mockHistory, employee: mockIndividual }, user: { UserID: mockUserID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockChangeCheck = jest.spyOn(HistoryController, "userCanChangeIndividual").mockResolvedValue(false);

    await HistoryController.addHistory(mockReq, mockRes);

    expect(mockChangeCheck).toBeCalledWith(mockUserID, mockIndividualID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should call addHistoryToDatabase if user is authorized to add history", async () => {
    const mockHistory = {};
    const mockUserID = 123;
    const mockIndividualID = 456;
    const mockIndividual = { id: mockIndividualID };
    const mockReq = { body: { newData: mockHistory, employee: mockIndividual }, user: { UserID: mockUserID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockChangeCheck = jest.spyOn(HistoryController, "userCanChangeIndividual").mockResolvedValue(true);
    const mockAddHistory = jest.spyOn(HistoryController, "addHistoryToDatabase").mockResolvedValue();

    await HistoryController.addHistory(mockReq, mockRes);

    expect(mockChangeCheck).toBeCalledWith(mockUserID, mockIndividualID);
    expect(mockAddHistory).toBeCalledWith(mockHistory, mockIndividual, mockUserID);
    expect(mockSendStatus).toBeCalledWith(200);
  });
});

describe("addHistoryToDatabase", () => {
  it("should throw an error if no company is found", async () => {
    const mockHistory = { company: "mock company", position: "mock position", start: "mock start", end: "mock end" };
    const mockIndividual = { id: 123, fundID: 456 };
    const mockUserID = 789;

    const mockCompanyLookup = jest.spyOn(database, "retrieveCompanyByName").mockResolvedValue(null);

    let errorThrown = false;
    try {
      await HistoryController.addHistoryToDatabase(mockHistory, mockIndividual, mockUserID);
      errorThrown = false;
    } catch (error) {
      errorThrown = true;
    }

    expect(mockCompanyLookup).toBeCalledWith("mock company", 456);
    expect(errorThrown).toEqual(true);
  });

  it("should call the database to insert history with a valid company", async () => {
    const mockHistory = { company: "mock company", position: "mock position", start: "mock start", end: "mock end" };
    const mockIndividual = { id: 123, fundID: 456 };
    const mockUserID = 789;
    const mockCompany = { CompanyID: 5 };

    const mockCompanyLookup = jest.spyOn(database, "retrieveCompanyByName").mockResolvedValue(mockCompany);
    const mockHistoryInsert = jest.spyOn(database, "insertEmployeeHistory").mockResolvedValue(null);

    let errorThrown = false;
    try {
      await HistoryController.addHistoryToDatabase(mockHistory, mockIndividual, mockUserID);
      errorThrown = false;
    } catch (error) {
      errorThrown = true;
    }

    expect(mockCompanyLookup).toBeCalledWith("mock company", 456);
    expect(errorThrown).toEqual(false);
    expect(mockHistoryInsert).toBeCalledWith(mockUserID, 123, 5, "mock position", "mock start", "mock end");
  });
});

describe("updateHistory", () => {
  it("should return 401 if user is not authorized to change history", async () => {
    const mockHistory = {};
    const mockIndividual = { id: 123 };
    const mockUserID = 456;
    const mockReq = { body: { newData: mockHistory, employee: mockIndividual }, user: { UserID: mockUserID } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockChangeCheck = jest.spyOn(HistoryController, "userCanChangeIndividual").mockResolvedValue(false);

    await HistoryController.updateHistory(mockReq, mockRes);

    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should return 200 if the user is authorized and the update is successful", async () => {
    const mockHistory = {};
    const mockIndividual = { id: 123 };
    const mockUserID = 456;
    const mockReq = { body: { newData: mockHistory, employee: mockIndividual }, user: { UserID: mockUserID } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockChangeCheck = jest.spyOn(HistoryController, "userCanChangeIndividual").mockResolvedValue(true);
    const mockUpdateHistory = jest.spyOn(HistoryController, "updateHistoryInDatabase").mockResolvedValue(null);

    await HistoryController.updateHistory(mockReq, mockRes);

    expect(mockUpdateHistory).toBeCalledWith(mockHistory, mockIndividual, mockUserID);
    expect(mockSendStatus).toBeCalledWith(200);
  });
});
