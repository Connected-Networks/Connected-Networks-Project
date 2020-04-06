require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../PeopleController";

describe("UpdatePerson", () => {
  it("should respond with 401 if user is not authorized to change the fund", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockPerson = { id: 123, fundID: mockFundID, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockPerson } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(false);
    console.error = jest.fn();

    await PeopleController.updatePerson(mockReq, mockRes);

    expect(mockUserCanChangeFund).toBeCalledWith(mockUserID, mockFundID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should update the person in database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockPerson = { id: 123, fundID: 54321, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockPerson } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockModifyIndividual = jest.spyOn(database, "modifyIndividual").mockResolvedValue(null);

    await PeopleController.updatePerson(mockReq, mockRes);

    expect(mockModifyIndividual).toBeCalledWith(mockPerson.id, mockPerson.name, mockPerson.hyperlink, mockPerson.comment);
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockPerson = { id: 123, fundID: 54321, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockPerson } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockModifyIndividual = jest.spyOn(database, "modifyIndividual").mockRejectedValue(new Error("Mock error"));

    await PeopleController.updatePerson(mockReq, mockRes);

    expect(mockModifyIndividual).toBeCalledWith(mockPerson.id, mockPerson.name, mockPerson.hyperlink, mockPerson.comment);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});

describe("UserCanChangeFund", () => {
  it("should return true if user owns the fund", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockOwnedFunds = ["5342", "3243", "54321", "", "12345"];

    const mockGetFundsUserCanChange = jest.spyOn(database, "getFundsUserCanChange").mockResolvedValue(mockOwnedFunds);

    const returnedValue = await PeopleController.userCanChangeFund(mockUserID, mockFundID);

    expect(mockGetFundsUserCanChange).toBeCalledWith(mockUserID);
    expect(returnedValue).toBe(true);
  });

  it("should return false if user does not own the fund", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockOwnedFunds = ["5342", "3243", "", "12345"];

    const mockGetFundsUserCanChange = jest.spyOn(database, "getFundsUserCanChange").mockResolvedValue(mockOwnedFunds);

    const returnedValue = await PeopleController.userCanChangeFund(mockUserID, mockFundID);

    expect(mockGetFundsUserCanChange).toBeCalledWith(mockUserID);
    expect(returnedValue).toBe(false);
  });

  it("should throw an error if database throws an error", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;

    const mockError = new Error("Mock error");
    const mockGetFundsUserCanChange = jest.spyOn(database, "getFundsUserCanChange").mockImplementation(() => {
      throw mockError;
    });
    console.error = jest.fn();

    try {
      await PeopleController.userCanChangeFund(mockUserID, mockFundID);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
