require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../../sequelizeDatabase/sequelFunctions");
const database = require("../../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../../PeopleController";

describe("getPeople", () => {
  it("should respond with people got from database", async () => {
    const mockUserID = 12345;
    const mockReq = { user: { UserID: mockUserID } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };
    const mockPeople = [{ id: 123, fundID: 1, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" }];

    const mockGetPeopleFromDatabase = jest.spyOn(PeopleController, "getPeopleFromDatabase").mockResolvedValue(mockPeople);

    await PeopleController.getPeople(mockReq, mockRes);

    expect(mockGetPeopleFromDatabase).toBeCalledTimes(1);
    expect(mockGetPeopleFromDatabase).toBeCalledWith(mockUserID);
    expect(mockSend).toBeCalledTimes(1);
    expect(mockSend).toBeCalledWith({ data: mockPeople });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockReq = { user: { UserID: mockUserID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockGetPeopleFromDatabase = jest
      .spyOn(PeopleController, "getPeopleFromDatabase")
      .mockRejectedValue(new Error("Mock error"));

    await PeopleController.getPeople(mockReq, mockRes);

    expect(mockGetPeopleFromDatabase).toBeCalledTimes(1);
    expect(mockGetPeopleFromDatabase).toBeCalledWith(mockUserID);
    expect(mockSendStatus).toBeCalledTimes(1);
    expect(mockSendStatus).toBeCalledWith(500);
  });
});
