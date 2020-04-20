require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../../sequelizeDatabase/sequelFunctions");
const database = require("../../../sequelizeDatabase/sequelFunctions");
import PeopleController from "../../../PeopleController";

describe("GetPeopleByOriginalCompany", () => {
  it("should respond with 401 if user is not authorized to see the company", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { companyID: mockCompanyID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserSeesCompany = jest.spyOn(PeopleController, "userSeesCompany").mockResolvedValue(false);
    console.error = jest.fn();

    await PeopleController.getPeopleByOriginalCompany(mockReq, mockRes);

    expect(mockUserSeesCompany).toBeCalledWith(mockUserID, mockCompanyID);
    expect(mockSendStatus).toBeCalledWith(401);
  });

  it("should respond with people gotten from database", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { companyID: mockCompanyID } };
    const mockSend = jest.fn();
    const mockRes = { send: mockSend };

    const mockPeople = [{ id: 123, fundID: 1, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" }];

    const mockUserSeesCompany = jest.spyOn(PeopleController, "userSeesCompany").mockResolvedValue(true);
    const mockRetrieveCurrentEmployeesOfCompany = jest
      .spyOn(PeopleController, "getPeopleByOriginalCompanyFromDatabase")
      .mockResolvedValue(mockPeople);

    await PeopleController.getPeopleByOriginalCompany(mockReq, mockRes);

    expect(mockRetrieveCurrentEmployeesOfCompany).toBeCalledWith(mockCompanyID);
    expect(mockSend).toBeCalledWith({ data: mockPeople });
  });

  it("should respond with 500 if database throws an error", async () => {
    const mockUserID = 12345;
    const mockCompanyID = 54321;
    const mockReq = { user: { UserID: mockUserID }, params: { companyID: mockCompanyID } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockUserSeesCompany = jest.spyOn(PeopleController, "userSeesCompany").mockResolvedValue(true);
    const mockRetrieveCurrentEmployeesOfCompany = jest
      .spyOn(PeopleController, "getPeopleByOriginalCompanyFromDatabase")
      .mockRejectedValue(new Error("Mock error"));

    await PeopleController.getPeopleByOriginalCompany(mockReq, mockRes);

    expect(mockSendStatus).toBeCalledWith(500);
  });
});

describe("getPeopleByOriginalCompanyFromDatabase", () => {
  it("should get people from database, map them to DisplayPerson and then return", async () => {
    const mockCompanyID = 12345;
    const mockPeople = [
      {
        individual: {
          IndividualID: 123,
          FundID: 1,
          Name: "Mock",
          Company: "",
          LinkedInUrl: "Mock",
          Comments: "",
        },
        PositionName: "",
      },
      {
        individual: {
          IndividualID: 321,
          FundID: 2,
          Name: "Mock2",
          Company: "",
          LinkedInUrl: "Mock2",
          Comments: "",
        },
        PositionName: "",
      },
    ];

    const mockRetrieveIndividualsByOriginalCompany = jest
      .spyOn(database, "retrieveIndividualsByOriginalCompany")
      .mockResolvedValue(mockPeople);

    const returnedPeople = await PeopleController.getPeopleByOriginalCompanyFromDatabase(mockCompanyID);

    expect(mockRetrieveIndividualsByOriginalCompany).toBeCalledWith(mockCompanyID);

    const expectedPeople = [
      { id: 123, fundID: 1, name: "Mock", company: null, position: "", hyperlink: "Mock", comment: "" },
      { id: 321, fundID: 2, name: "Mock2", company: null, position: "", hyperlink: "Mock2", comment: "" },
    ];
    expect(returnedPeople).toEqual(expectedPeople);
  });
});
