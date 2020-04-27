require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import HistoryController from "../../HistoryController";
import FundsController from "../../FundsController";
import PeopleController from "../../PeopleController";
import UpdatesController, { Change } from "../../UpdatesController";
import * as moment from "moment";

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

describe("updateHistoryInDatabase", () => {
  it("should throw an error if no company is found", async () => {
    const mockHistory = { company: "mock company", position: "mock position", start: "mock start", end: "mock end" };
    const mockIndividual = { id: 123, fundID: 456 };
    const mockUserID = 789;

    const mockCompanyLookup = jest.spyOn(database, "retrieveCompanyByName").mockResolvedValue(null);

    let errorThrown = false;
    try {
      await HistoryController.updateHistoryInDatabase(mockHistory, mockIndividual, mockUserID);
      errorThrown = false;
    } catch (error) {
      errorThrown = true;
    }

    expect(mockCompanyLookup).toBeCalledWith("mock company", 456);
    expect(errorThrown).toEqual(true);
  });

  it("should call the database to update history with a valid company", async () => {
    const mockHistory = { id: 3, company: "mock company", position: "mock position", start: "mock start", end: "mock end" };
    const mockIndividual = { id: 123, fundID: 456 };
    const mockUserID = 789;
    const mockCompany = { CompanyID: 5 };

    const mockCompanyLookup = jest.spyOn(database, "retrieveCompanyByName").mockResolvedValue(mockCompany);
    const mockHistoryUpdate = jest.spyOn(database, "updateEmployeeHistory").mockResolvedValue(null);

    let errorThrown = false;
    try {
      await HistoryController.updateHistoryInDatabase(mockHistory, mockIndividual, mockUserID);
      errorThrown = false;
    } catch (error) {
      errorThrown = true;
    }

    expect(mockCompanyLookup).toBeCalledWith("mock company", 456);
    expect(errorThrown).toEqual(false);
    expect(mockHistoryUpdate).toBeCalledWith(3, mockUserID, 123, 5, "mock position", "mock start", "mock end");
  });
});

describe("deleteHistory", () => {
  it("should return 401 if user is not authorized to delete the history", async () => {
    const mockIndividual = { id: 123 };
    const mockUserID = 456;
    const mockReq = { body: { employee: mockIndividual }, user: { UserID: mockUserID }, params: { id: 1 } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockChangeCheck = jest.spyOn(HistoryController, "userCanChangeIndividual").mockResolvedValue(false);

    await HistoryController.deleteHistory(mockReq, mockRes);

    expect(mockSendStatus).toBeCalledWith(401);
  });
  it("should return 200 and call deleteEmployeeHistory if the user is authorized", async () => {
    const mockIndividual = { id: 123 };
    const mockUserID = 456;
    const mockReq = { body: { employee: mockIndividual }, user: { UserID: mockUserID }, params: { id: 1 } };

    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockChangeCheck = jest.spyOn(HistoryController, "userCanChangeIndividual").mockResolvedValue(true);
    const mockDelete = jest.spyOn(database, "deleteEmployeeHistory").mockResolvedValue(null);

    await HistoryController.deleteHistory(mockReq, mockRes);

    expect(mockDelete).toBeCalledWith(1);
    expect(mockSendStatus).toBeCalledWith(200);
  });
});

describe("applyChanges", () => {
  it("should call various functions on each change", async () => {
    let employee = { fundId: 1, id: 2, name: "mock employee", linkedInUrl: "xxx" };
    let from = { company: "company 1", position: "position 1", startDate: "yyy" };
    let to = { company: "company 2", position: "position 2", startDate: "start", endDate: "end" };
    let change1: Change = { employee, to, from };
    let changes = [change1];

    const mockCompany = { CompanyID: 7 };
    const mockFund = { UserID: 3 };
    const mockEmployment = { HistoryID: 11, UserID: 12, IndividualID: 13, CompanyID: 14, PositionName: 15, StartDate: 16 };

    const mockInsertCompany = jest.spyOn(database, "insertCompany").mockResolvedValue(mockCompany);
    const mockGetFund = jest.spyOn(database, "getFundById").mockResolvedValue(mockFund);
    const mockGetEmployment = jest.spyOn(database, "getIndividualCurrentEmployement").mockResolvedValue(mockEmployment);
    const mockUpdateEmployment = jest.spyOn(database, "updateEmployeeHistory").mockResolvedValue(null);
    const mockInsertHistory = jest.spyOn(database, "insertEmployeeHistory").mockResolvedValue(null);

    await HistoryController.applyChanges(changes);

    expect(mockInsertCompany).toBeCalledWith("company 2", 1);
    expect(mockGetFund).toBeCalledWith(1);
    expect(mockGetEmployment).toBeCalledWith(2);
    expect(mockUpdateEmployment).toBeCalledWith(11, 12, 13, 14, 15, 16, moment(new Date()).format("YYYY-MM-DD"));
    expect(mockInsertHistory).toBeCalledWith(3, 2, 7, "position 2", "start", "end");
  });
});
