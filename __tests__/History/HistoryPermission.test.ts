require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import HistoryController from "../../HistoryController";
import FundsController from "../../FundsController";
import PeopleController from "../../PeopleController";

describe("userCanSeeIndividual", () => {
  it("should defer to user ability to see fund", async () => {
    const mockUserID = 12;
    const mockIndividualID = 123;
    const mockFundID = 1234;
    const mockPerson = { IndividualID: mockIndividualID, FundID: mockFundID };

    const mockUserLookup = jest.spyOn(database, "retrieveIndividualByID").mockResolvedValue(mockPerson);
    const mockVerification = jest.spyOn(FundsController, "userSeesFund").mockResolvedValue(true);

    await HistoryController.userCanSeeIndividual(mockUserID, mockIndividualID);

    expect(mockUserLookup).toBeCalledWith(mockIndividualID);
    expect(mockVerification).toBeCalledWith(mockUserID, mockFundID);
  });
});

describe("userCanChangeIndividual", () => {
  it("should defer to user ability to change fund", async () => {
    const mockUserID = 12;
    const mockIndividualID = 123;
    const mockFundID = 1234;
    const mockPerson = { IndividualID: mockIndividualID, FundID: mockFundID };

    const mockUserLookup = jest.spyOn(database, "retrieveIndividualByID").mockResolvedValue(mockPerson);
    const mockVerification = jest.spyOn(PeopleController, "userCanChangeFund").mockResolvedValue(true);

    await HistoryController.userCanChangeIndividual(mockUserID, mockIndividualID);

    expect(mockUserLookup).toBeCalledWith(mockIndividualID);
    expect(mockVerification).toBeCalledWith(mockUserID, mockFundID);
  });
});
