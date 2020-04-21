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

describe("getPeopleFromDatabase", () => {
  it("should get people from database, map them to DisplayPerson and then return", async () => {
    const mockUserID = 12345;
    const mockPeople = [
      { IndividualID: 123, FundID: 1, Name: "Mock", company: "", position: "", LinkedInUrl: "Mock", comments: "" },
      { IndividualID: 321, FundID: 2, Name: "Mock2", company: "", position: "", LinkedInUrl: "Mock2", comments: "" },
    ];
    const mockDisplayPeople = [
      { id: 123, fundID: 1, name: "Mock", company: "", position: "", hyperlink: "Mock", comment: "" },
      { id: 321, fundID: 2, name: "Mock2", company: "", position: "", hyperlink: "Mock2", comment: "" },
    ];

    const mockGetAllIndividualsOfUser = jest.spyOn(database, "getAllIndividualsOfUser").mockResolvedValue(mockPeople);
    const mockProcessIndividualForDisplay = jest
      .spyOn(PeopleController, "processIndividualForDisplay")
      .mockResolvedValueOnce(mockDisplayPeople[0])
      .mockResolvedValueOnce(mockDisplayPeople[1]);

    const returnedPeople = await PeopleController.getPeopleFromDatabase(mockUserID);

    expect(mockGetAllIndividualsOfUser).toBeCalledWith(mockUserID);
    expect(mockProcessIndividualForDisplay).toBeCalledWith(mockPeople[0]);
    expect(mockProcessIndividualForDisplay).toBeCalledWith(mockPeople[1]);

    expect(returnedPeople[0]).toBe(mockDisplayPeople[0]);
    expect(returnedPeople[1]).toBe(mockDisplayPeople[1]);
  });
});

describe("processIndividualForDisplay", () => {
  it("should convert the given individual object to DisplayPerson object", async () => {
    const mockIndividualID = 12345;
    const mockIndividual = {
      IndividualID: mockIndividualID,
      FundID: 1,
      Name: "Mock",
      company: "",
      position: "",
      LinkedInUrl: "Mock",
      Comments: "",
    };

    const mockCompanyName = "MockCompany";
    const mockPositionName = "MockPosition";
    const mockEmployment = { company: { CompanyName: mockCompanyName }, PositionName: mockPositionName };

    const mockGetIndividualCurrentEmployement = jest
      .spyOn(database, "getIndividualCurrentEmployement")
      .mockResolvedValue(mockEmployment);

    const returnedPerson = await PeopleController.processIndividualForDisplay(mockIndividual);

    expect(mockGetIndividualCurrentEmployement).toBeCalledWith(mockIndividualID);

    expect(returnedPerson.id).toBe(mockIndividual.IndividualID);
    expect(returnedPerson.fundID).toBe(mockIndividual.FundID);
    expect(returnedPerson.name).toBe(mockIndividual.Name);
    expect(returnedPerson.company).toBe(mockCompanyName);
    expect(returnedPerson.position).toBe(mockPositionName);
    expect(returnedPerson.hyperlink).toBe(mockIndividual.LinkedInUrl);
    expect(returnedPerson.comment).toBe(mockIndividual.Comments);
  });
});
