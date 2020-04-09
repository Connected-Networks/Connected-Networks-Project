require("mysql2/node_modules/iconv-lite").encodingExists("foo"); //Required due to some bug in Jest

jest.mock("../../sequelizeDatabase/sequelFunctions");
const database = require("../../sequelizeDatabase/sequelFunctions");
import ParsingController from "../../ParsingController";

describe("handleCsvRequest", () => {
  it("should respond with 200 if processRawCSV() succeeded", async () => {
    const mockUserID = 12345;
    const mockData = {};
    const mockFileName = "Mock file name";
    const mockReq = { user: { UserID: mockUserID }, body: { data: mockData, fileName: mockFileName } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockProcessRawCSV = jest.spyOn(ParsingController, "processRawCSV").mockResolvedValue(null);

    await ParsingController.handleCsvRequest(mockReq, mockRes);

    expect(mockProcessRawCSV).toBeCalledTimes(1);
    expect(mockProcessRawCSV).toBeCalledWith(mockData, mockFileName, mockUserID);

    expect(mockSendStatus).toBeCalledWith(200);
  });

  it("should respond with 500 if processRawCSV() throws an error", async () => {
    const mockUserID = 12345;
    const mockData = {};
    const mockFileName = "Mock file name";
    const mockReq = { user: { UserID: mockUserID }, body: { data: mockData, fileName: mockFileName } };
    const mockSendStatus = jest.fn();
    const mockRes = { sendStatus: mockSendStatus };

    const mockProcessRawCSV = jest.spyOn(ParsingController, "processRawCSV").mockRejectedValue(new Error("Mock error"));

    await ParsingController.handleCsvRequest(mockReq, mockRes);

    expect(mockProcessRawCSV).toBeCalledTimes(1);
    expect(mockProcessRawCSV).toBeCalledWith(mockData, mockFileName, mockUserID);

    expect(mockSendStatus).toBeCalledWith(500);
  });
});
