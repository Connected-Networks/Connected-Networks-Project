import UsersController from "../../UsersController";

require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");

describe("getOtherUsers", () => {
  it("should return the users returned by the database", async () => {
    const mockReq = { user: { UserID: 123 } };
    const mockReturn = [456, 789];
    const mockSendStatus = jest.fn();
    const mockSend = jest.fn();
    const mockRes = { sendStatus: mockSendStatus, send: mockSend };

    const mockGetOThers = jest.spyOn(UsersController, "getOtherUsersFromDatabase").mockResolvedValue(mockReturn);

    await UsersController.getOtherUsers(mockReq, mockRes);

    expect(mockSend).toBeCalledWith({ users: mockReturn });
  });
});

describe("getOtherUsersFromDatabase", () => {
  it("should return all users except for the specified user", async () => {
    const mockList = [
      { UserID: 1, Username: "name 1" },
      { UserID: 2, Username: "name 2" },
      { UserID: 3, Username: "name 3" },
    ];
    const mockGetUsers = jest.spyOn(database, "getAllUsers").mockResolvedValue(mockList);
    const list = await UsersController.getOtherUsersFromDatabase(1);
    expect(mockGetUsers).toBeCalled();
    expect(list).toEqual([
      { id: 2, name: "name 2" },
      { id: 3, name: "name 3" },
    ]);
  });
});
