require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../PeopleController";

describe("AddPerson", () => {
  it("should respond with 401 if user is not authorized to change the fund", async () => {
    const mockUserID = 12345;
    const mockFundID = 54321;
    const mockPerson = { id: 123, fundID: mockFundID, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockPerson } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(false);
    console.error = jest.fn();

    await PeopleController.addPerson(mockReq, mockRes);

    expect(mockUserCanChangeFund).toBeCalledWith(mockUserID, mockFundID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should update the person in database and respond with 200", async () => {
    const mockUserID = 12345;
    const mockPerson = {
      id: 123,
      fundID: 54321,
      name: "Mock",
      company: "",
      position: "MockPosition",
      hyperlink: "MockLink",
      comment: "",
    };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockPerson } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockInsertPerson = jest.spyOn(database, "insertPerson").mockResolvedValue(null);

    await PeopleController.addPerson(mockReq, mockRes);

    expect(mockInsertPerson).toBeCalledWith(
      mockPerson.name,
      mockPerson.fundID,
      mockPerson.position,
      mockPerson.hyperlink,
      mockPerson.comment
    );
    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockPerson = { id: 123, fundID: 54321, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" };
    const mockReq = { user: { UserID: mockUserID }, body: { newData: mockPerson } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserCanChangeFund = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    const mockInsertPerson = jest.spyOn(database, "insertPerson").mockRejectedValue(new Error("Mock error"));

    await PeopleController.addPerson(mockReq, mockRes);

    expect(mockInsertPerson).toBeCalledWith(
      mockPerson.name,
      mockPerson.fundID,
      mockPerson.position,
      mockPerson.hyperlink,
      mockPerson.comment
    );
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
