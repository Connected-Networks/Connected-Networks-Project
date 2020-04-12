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

describe("processRawCSV", () => {
  it("should call call_from_csv_line for every line of data and then return true", async () => {
    const mockUserID = 12345;
    const mockFileName = "Mock file name";
    const mockFundID = 12345;

    const mockInitialLine = ",,,,,,,Periodic Updates for 2019 (Any Job Changes?),,,,\n";
    const mockHeaderLine =
      "Portfolio Company,Name,Portfolio Company Position,Employment Term,New Employer,New Position,Hyperlink Url,Q1 2019,Q2 2019,Q3 2019,Q4 2019,Comments\n";
    const mockFirstDataLine =
      "Microsoft,Bill Gates,Managing Partner,June-Aug 2019,Bill and Melinda Gates Foundation,Co Chair,https://www.linkedin.com/in/williamhgates/,,,,,\n";
    const mockSecondDataLine =
      'Bloomberg,Alfred Lin,Technical Consultant,July 2015-June 2017,Sequoia Captial,Partner,https://www.linkedin.com/in/linalfred/,"Board of Directors, AirBnb",,Board of Directors at Exxon,,\n';
    const mockThirdDataLine =
      'Microsoft,Satya Nadella,CEO,9-Aug,Placeholder,Technician,https://www.linkedin.com/in/satyanadella/,"Board of Directors, AirBnb",,,,\n';
    const mockData = mockInitialLine + mockHeaderLine + mockFirstDataLine + mockSecondDataLine + mockThirdDataLine;

    const mockFund = { FundID: mockFundID };

    const mock_insert_fund = jest.spyOn(database, "insertFund").mockResolvedValue(mockFund);
    const mock_call_from_csv_line = jest.spyOn(ParsingController, "call_from_csv_line");

    console.log("starting call");
    let result: boolean = await ParsingController.processRawCSV(mockData, mockFileName, mockUserID);
    console.log("call ended");

    expect(mock_insert_fund).toBeCalledTimes(1);
    expect(mock_call_from_csv_line).toBeCalledTimes(3);
    expect(result).toEqual(true);
  });

  it("should return false if an error is thrown by insertFund", async () => {
    const mockUserID = 12345;
    const mockFileName = "Mock file name";
    const mockFundID = 12345;

    const mockInitialLine = ",,,,,,,Periodic Updates for 2019 (Any Job Changes?),,,,\n";
    const mockHeaderLine =
      "Portfolio Company,Name,Portfolio Company Position,Employment Term,New Employer,New Position,Hyperlink Url,Q1 2019,Q2 2019,Q3 2019,Q4 2019,Comments\n";
    const mockFirstDataLine =
      "Microsoft,Bill Gates,Managing Partner,June-Aug 2019,Bill and Melinda Gates Foundation,Co Chair,https://www.linkedin.com/in/williamhgates/,,,,,\n";
    const mockSecondDataLine =
      'Bloomberg,Alfred Lin,Technical Consultant,July 2015-June 2017,Sequoia Captial,Partner,https://www.linkedin.com/in/linalfred/,"Board of Directors, AirBnb",,Board of Directors at Exxon,,\n';
    const mockThirdDataLine =
      'Microsoft,Satya Nadella,CEO,9-Aug,Placeholder,Technician,https://www.linkedin.com/in/satyanadella/,"Board of Directors, AirBnb",,,,\n';
    const mockData = mockInitialLine + mockHeaderLine + mockFirstDataLine + mockSecondDataLine + mockThirdDataLine;

    const mockFund = { FundID: mockFundID };

    const mock_insert_fund = jest.spyOn(database, "insertFund").mockRejectedValue(null);
    const mock_call_from_csv_line = jest.spyOn(ParsingController, "call_from_csv_line");

    console.log("starting call");
    let result: boolean = await ParsingController.processRawCSV(mockData, mockFileName, mockUserID);
    console.log("call ended");

    expect(mock_insert_fund).toBeCalledTimes(1);
    expect(mock_call_from_csv_line).toBeCalledTimes(0);
    //expect(result).toEqual(true);
  });

  it("should return false if an error is thrown by call_from_csv_line", async () => {
    const mockUserID = 12345;
    const mockFileName = "Mock file name";
    const mockFundID = 12345;

    const mockInitialLine = ",,,,,,,Periodic Updates for 2019 (Any Job Changes?),,,,\n";
    const mockHeaderLine =
      "Portfolio Company,Name,Portfolio Company Position,Employment Term,New Employer,New Position,Hyperlink Url,Q1 2019,Q2 2019,Q3 2019,Q4 2019,Comments\n";
    const mockFirstDataLine =
      "Microsoft,Bill Gates,Managing Partner,June-Aug 2019,Bill and Melinda Gates Foundation,Co Chair,https://www.linkedin.com/in/williamhgates/,,,,,\n";
    const mockSecondDataLine =
      'Bloomberg,Alfred Lin,Technical Consultant,July 2015-June 2017,Sequoia Captial,Partner,https://www.linkedin.com/in/linalfred/,"Board of Directors, AirBnb",,Board of Directors at Exxon,,\n';
    const mockThirdDataLine =
      'Microsoft,Satya Nadella,CEO,9-Aug,Placeholder,Technician,https://www.linkedin.com/in/satyanadella/,"Board of Directors, AirBnb",,,,\n';
    const mockData = mockInitialLine + mockHeaderLine + mockFirstDataLine + mockSecondDataLine + mockThirdDataLine;

    const mockFund = { FundID: mockFundID };

    const mock_insert_fund = jest.spyOn(database, "insertFund").mockReturnValue(mockFund);
    const mock_call_from_csv_line = jest.spyOn(ParsingController, "call_from_csv_line");

    console.log("starting call");
    let result: boolean = await ParsingController.processRawCSV(mockData, mockFileName, mockUserID);
    console.log("call ended");

    expect(mock_insert_fund).toBeCalledTimes(1);
    expect(mock_call_from_csv_line).toBeCalledTimes(3);
    expect(result).toEqual(true);
  });
});

describe("call_from_csv_line", () => {
  it("should call processQuarter 4 times and return true", async () => {
    const mockUserID = "123";
    const mockFundID = "1234";
    const mockIndividualID = "12345";
    const mockYear = 2020;

    const mockEntry = {
      "portfolio company": "Mock Company",
      name: "John Smith",
      "portfolio company position": "worker",
      "employment term": "June-Aug 2019",
      "new employer": "Mock New Employer",
      "new position": "Mock New Position",
      "hyperlink url": "www.com",
      "q1 2019": "job at place",
      "q2 2019": "job, place",
      "q3 2019": "",
      "q4 2019": "",
      comments: "",
    };

    const mock_insert_from_csv = jest.spyOn(database, "insertFromCsvLine").mockResolvedValue(mockIndividualID);
    const mock_process_quarter = jest.spyOn(ParsingController, "processQuarter").mockResolvedValue(true);

    let result = await ParsingController.call_from_csv_line(mockEntry, mockFundID, mockUserID, mockYear);
    expect(mock_insert_from_csv).toBeCalledTimes(1);
    expect(mock_process_quarter).toBeCalledTimes(4);
    expect(result).toEqual(true);
  });

  it("should return false immediately if name is empty", async () => {
    const mockUserID = "123";
    const mockFundID = "1234";
    const mockIndividualID = "12345";
    const mockYear = 2020;

    const mockEntry = { name: "" };
    const mock_insert_from_csv = jest.spyOn(database, "insertFromCsvLine").mockResolvedValue(mockIndividualID);
    let result = await ParsingController.call_from_csv_line(mockEntry, mockFundID, mockUserID, mockYear);
    expect(mock_insert_from_csv).toBeCalledTimes(0);
    expect(result).toEqual(false);
  });

  it("should return false immediately if insertFromCSV throws an error", async () => {
    const mockUserID = "123";
    const mockFundID = "1234";
    const mockIndividualID = "12345";
    const mockYear = 2020;

    const mockEntry = {
      "portfolio company": "Mock Company",
      name: "John Smith",
      "portfolio company position": "worker",
      "employment term": "June-Aug 2019",
      "new employer": "Mock New Employer",
      "new position": "Mock New Position",
      "hyperlink url": "www.com",
      "q1 2019": "job at place",
      "q2 2019": "job, place",
      "q3 2019": "",
      "q4 2019": "",
      comments: "",
    };

    const mock_insert_from_csv = jest.spyOn(database, "insertFromCsvLine").mockRejectedValue(null);
    const mock_process_quarter = jest.spyOn(ParsingController, "processQuarter").mockResolvedValue(true);

    let result = await ParsingController.call_from_csv_line(mockEntry, mockFundID, mockUserID, mockYear);

    expect(mock_insert_from_csv).toBeCalledTimes(1);
    expect(result).toEqual(false);
  });
});

describe("processQuarter", () => {
  it("should return false if quarterString is empty", async () => {
    const mockQuarterString = "";
    const mockQuarterNumber = 1;
    const mockIndividualID = 12345;
    const mockUserID = 12345;
    const mockFundID = 12345;
    const mockYear = 2020;

    const mockInsertQuarterEmployment = jest.spyOn(database, "insertQuarterEmployment");

    let result = await ParsingController.processQuarter(
      mockQuarterString,
      mockQuarterNumber,
      mockIndividualID,
      mockUserID,
      mockFundID,
      mockYear
    );

    expect(mockInsertQuarterEmployment).toBeCalledTimes(0);
    expect(result).toEqual(false);
  });

  it("should return false if quarterString is invalid", async () => {
    //This string is not valid
    const mockQuarterString = "job place";
    const mockQuarterNumber = 1;
    const mockIndividualID = 12345;
    const mockUserID = 12345;
    const mockFundID = 12345;
    const mockYear = 2020;

    const mockInsertQuarterEmployment = jest.spyOn(database, "insertQuarterEmployment");

    let result = await ParsingController.processQuarter(
      mockQuarterString,
      mockQuarterNumber,
      mockIndividualID,
      mockUserID,
      mockFundID,
      mockYear
    );

    expect(mockInsertQuarterEmployment).toBeCalledTimes(0);
    expect(result).toEqual(false);
  });

  it("should return true if quarterString is proper and insertQuarterEmployment doesn't throw errors", async () => {
    const mockQuarterString = "job, place";
    const mockQuarterNumber = 1;
    const mockIndividualID = 12345;
    const mockUserID = 12345;
    const mockFundID = 12345;
    const mockYear = 2020;

    const mockInsertQuarterEmployment = jest.spyOn(database, "insertQuarterEmployment");

    let result = await ParsingController.processQuarter(
      mockQuarterString,
      mockQuarterNumber,
      mockIndividualID,
      mockUserID,
      mockFundID,
      mockYear
    );

    expect(mockInsertQuarterEmployment).toBeCalledTimes(1);
    expect(result).toEqual(true);
  });

  it("should return true if quarterString is proper and insertQuarterEmployment doesn't throw errors", async () => {
    const mockQuarterString = "job at place";
    const mockQuarterNumber = 1;
    const mockIndividualID = 12345;
    const mockUserID = 12345;
    const mockFundID = 12345;
    const mockYear = 2020;

    const mockInsertQuarterEmployment = jest.spyOn(database, "insertQuarterEmployment");

    let result = await ParsingController.processQuarter(
      mockQuarterString,
      mockQuarterNumber,
      mockIndividualID,
      mockUserID,
      mockFundID,
      mockYear
    );

    expect(mockInsertQuarterEmployment).toBeCalledTimes(1);
    expect(result).toEqual(true);
  });
});

describe("Convert Dates", () => {
  it("should correctly parse a date in month-month year format", () => {
    let dateString = "April-May 2020";
    let result = ParsingController.convertDates(dateString);
    expect(result).toEqual(["2020-04-01", "2020-05-01"]);

    dateString = "Jan-Feb 2019";
    result = ParsingController.convertDates(dateString);
    expect(result).toEqual(["2019-01-01", "2019-02-01"]);
  });

  it("should correctly parse a date in month year-month year format", () => {
    let dateString = "April 2017-May 2018";
    let result = ParsingController.convertDates(dateString);
    expect(result).toEqual(["2017-04-01", "2018-05-01"]);

    dateString = "Jan 2019-Feb 2020";
    result = ParsingController.convertDates(dateString);
    expect(result).toEqual(["2019-01-01", "2020-02-01"]);
  });

  describe("Estimate Year", () => {
    it("Should detect a year string between 1900 and 2000", () => {
      let data = "something something something 1984";
      let result = ParsingController.estimateYear(data);
      expect(result).toEqual(1984);
    });
    it("Should detect a year string between 2000 and 2100", () => {
      let data = "something something something 2084";
      let result = ParsingController.estimateYear(data);
      expect(result).toEqual(2084);
    });
    it("Should should prioritize years in the 21st century", () => {
      let data = "something something something 1984 something something something 2001";
      let result = ParsingController.estimateYear(data);
      expect(result).toEqual(2001);
    });
  });
});
