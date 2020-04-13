import { resolve } from "dns";

require("dotenv").config();
require("mysql");
const papa = require("papaparse");
const database = require("./sequelizeDatabase/sequelFunctions");

export default class ParsingController {
  static async handleCsvRequest(req, res) {
    try {
      let data = req.body.data;
      let fileName = req.body.fileName;
      let userID = req.user.UserID;
      const results = await ParsingController.processRawCSV(data, fileName, userID);

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async processRawCSV(data: string, fileName: string, userID): Promise<boolean> {
    //First line is commented and ignored
    //Second line is treated as header

    try {
      let fundName = fileName;
      let year = new Date().getFullYear().toString();
      year = ParsingController.estimateYear(data).toString();

      var results = papa.parse("#" + data, {
        //Adding a # causes the parser to skip the first row, treat the second row as header
        header: true,
        comments: "#",
        beforeFirstChunk: function (chunk) {
          let fi = chunk.indexOf("\n");
          let si = chunk.indexOf("\n", fi + 1);
          let fs = chunk.substring(0, fi);
          let ms = chunk.substring(fi, si);
          let ls = chunk.substring(si, chunk.length);
          chunk = fs + ms.toLowerCase() + ls;
          console.log("chunk: " + chunk);
          return chunk;
        },
      });
      //console.log(JSON.stringify(results));
      let fund = await database.insertFund(fundName, userID);
      console.log(JSON.stringify(fund));
      results.data.map(async (element) => {
        try {
          if (element["name"] != null) await ParsingController.call_from_csv_line(element, fund.FundID, userID, year);
        } catch (error) {
          console.error("an error occurred in processRawCSV while processing a row from the csv file");
          console.error("element: " + JSON.stringify(element));
        }
      });
      console.log("done");
      return true;
    } catch (error) {
      console.error("an error occurred in processRawCSV, not while processing an individual row");
      return false;
    }
  }

  //Papaparse creates JSON objects with fields: name,position, employment term, etc.
  //This function assumes that the header is the second line of the csv file, with data starting on the third line
  //This function converts all header strings to lowercase, so all retrievals use lowercase keys
  static async call_from_csv_line(entry, fundID, userID, year): Promise<boolean> {
    try {
      let name: String = entry["name"];
      if (name.length < 1) {
        return false;
      }
      let firstCompany = entry["portfolio company"];
      let firstPosition = entry["portfolio company position"];
      let position = entry["new position"];
      let employer = entry["new employer"];
      let term = entry["employment term"];
      term = ParsingController.convertDates(term);
      let sterm = "";
      let eterm = "";
      if (term != null) {
        sterm = term[0];
        eterm = term[1];
      }
      let url = entry["hyperlink url"];
      let comments = entry["comments"];

      let individualID = await database.insertFromCsvLine(
        userID,
        fundID,
        firstCompany,
        name,
        firstPosition,
        sterm,
        eterm,
        employer,
        position,
        url,
        comments
      );
      console.log("passed");
      let q1 = entry["q1 " + year];
      let q2 = entry["q2 " + year];
      let q3 = entry["q3 " + year];
      let q4 = entry["q4 " + year];
      await ParsingController.processQuarter(q1, 1, individualID, userID, fundID, year);
      await ParsingController.processQuarter(q2, 2, individualID, userID, fundID, year);
      await ParsingController.processQuarter(q3, 3, individualID, userID, fundID, year);
      await ParsingController.processQuarter(q4, 4, individualID, userID, fundID, year);
      return true;
    } catch (error) {
      console.error("An error occurred in call_line_from_csv");
      console.error(error);
      return false;
    }
  }

  static convertDates(dates: String): string[] {
    console.log(`Parsing date: ${dates}`);
    let answer: string[];
    let dcount = 0;
    let dindex = -1;
    for (let i = 0; i < dates.length; i++) {
      if (dates.charAt(i) == "-") {
        dcount += 1;
        dindex = i;
      }
    }
    if (dcount != 1) {
      console.log("date cannot be read");
      return null;
    }
    let start = dates.slice(0, dindex);
    let end = dates.slice(dindex + 1);
    let se = start.slice(start.length - 4);
    if (isNaN(Number(se))) start += ` ${end.slice(end.length - 4)}`;
    let a = ParsingController.convertMY(start);
    let b = ParsingController.convertMY(end);
    if (a == null || b == null) {
      console.log("date cannot be read, may be a problem with the month");
      return null;
    }
    answer = [a, b];
    return answer;
  }
  static convertMY(line: string): string {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let s = line.split(" ");
    let mi = months.indexOf(s[0]) + 1;
    if (mi == 0) mi = monthsAbbr.indexOf(s[0]) + 1;
    if (mi == 0) return null;
    let mis = String(mi);
    if (mis.length == 1) mis = "0" + mi;
    return `${s[s.length - 1]}-${mis}-01`;
  }

  static async processQuarter(quarterString, quarterNumber, individualID, userID, fundID, year): Promise<boolean> {
    if (quarterString == null || quarterString == "") return false;
    let quarterStartDates = [year + "/01/01", year + "/04/01", year + "/07/01", year + "/10/01"];
    let quarterEndDates = [year + "/03/031", year + "/06/30", year + "/09/30", year + "/12/31"];
    let positionName = "";
    let companyName = "";
    let p = quarterString.indexOf(" at ");
    if (p > 0) {
      positionName = quarterString.substring(0, p);
      companyName = quarterString.substring(p + 4);
    }
    p = quarterString.indexOf(",");
    if (p > 0) {
      positionName = quarterString.substring(0, p);
      companyName = quarterString.substring(p + 1);
    }
    companyName = companyName.trim();
    if (positionName == "" || companyName == "") return false;
    await database.insertQuarterEmployment(
      userID,
      individualID,
      fundID,
      companyName,
      positionName,
      quarterStartDates[quarterNumber - 1]
    );
    return true;
  }

  static estimateYear(line: string): number {
    line = line + "xxxx";
    let i = line.indexOf("Q1 20");
    let j = line.substring(i + 3, i + 8);
    let k = Number.parseInt(j);
    if (k >= 2000) return k;
    i = line.indexOf("20");
    j = line.substring(i, i + 5);
    k = Number.parseInt(j);
    if (k >= 2000) return k;
    i = line.indexOf("Q1 19");
    j = line.substring(i + 3, i + 8);
    k = Number.parseInt(j);
    if (k >= 1900 && k < 2000) return k;
    i = line.indexOf("19");
    j = line.substring(i, i + 5);
    k = Number.parseInt(j);
    if (k >= 1900 && k < 2000) return k;
    console.log("Could not find year for quarter updates, defaulting to current year.");
    return new Date().getFullYear();
  }
}
