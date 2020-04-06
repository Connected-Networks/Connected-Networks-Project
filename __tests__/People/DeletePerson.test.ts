require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../PeopleController";

describe("DeletePerson", () => {
  it("should respond with 401 if user is not authorized to change the fund", async () => {
    const mockUserID = 12345;
    const mockPersonID = 44;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockPersonID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockRetrieveIndividualByID = jest.spyOn(database, "retrieveIndividualByID").mockResolvedValue({ FundID: mockFundID });
    console.error = jest.fn();

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(false);

    await PeopleController.deletePerson(mockReq, mockRes);

    expect(mockRetrieveIndividualByID).toBeCalledWith(mockPersonID);
    expect(mockUserCanChangeFund).toBeCalledWith(mockUserID, mockFundID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should delete the person in database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockPersonID = 44;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockPersonID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockRetrieveIndividualByID = jest.spyOn(database, "retrieveIndividualByID").mockResolvedValue({ FundID: mockFundID });
    console.error = jest.fn();
    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockDeleteIndividual = jest.spyOn(database, "deleteIndividual").mockResolvedValue(null);

    await PeopleController.deletePerson(mockReq, mockRes);

    expect(mockDeleteIndividual).toBeCalledWith(mockPersonID);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockPersonID = 44;
    const mockFundID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { id: mockPersonID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockRetrieveIndividualByID = jest.spyOn(database, "retrieveIndividualByID").mockResolvedValue({ FundID: mockFundID });
    console.error = jest.fn();
    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockDeleteIndividual = jest.spyOn(database, "deleteIndividual").mockRejectedValue(new Error("Mock error"));

    await PeopleController.deletePerson(mockReq, mockRes);

    expect(mockDeleteIndividual).toBeCalledWith(mockPersonID);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
