import { MysqlError } from "mysql";

const denv = require("dotenv").config();
const mysql = require("mysql");
const papa = require("papaparse");
let result = require("dotenv").config();

interface DisplayPerson {
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

export default class BackendProcessing {
  async create_connection_to_database(): Promise<any> {
    let con = mysql.createConnection({
      database: process.env.DATABASE,
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD
    });
    return new Promise((resolve, reject) =>
      con.connect(err => {
        if (err) {
          console.log("Error connecting to database");
          console.log(err);
          reject(err);
        } else {
          console.log("Database connection established");
          console.log();
          resolve(con);
        }
      })
    );
  }

  async processRawCSV(data: string) {
    //First line is commented and ignored
    //Second line is treated as header
    let con = await this.create_connection_to_database();
    var results = papa.parse("#" + data, { header: true, comments: "#" });
    await results.data.forEach(element => {
      if (element["Name"] != null) this.call_from_csv_line(element, con);
    });
    this.end_connection(con);
  }

  async call_from_csv_line(element, con) {
    let pcall = this.createCallForCSV(element);
    if (pcall != null) {
      console.log(`Sending to db: ${pcall}`);
      con.query(pcall, (err, rows) => {
        if (err) console.log("error from database: " + err);
        else console.log(rows);
      });
    }
  }

  async retrievePeopleFromDatabase(): Promise<DisplayPerson[]> {
    let con = await this.create_connection_to_database();
    return new Promise<DisplayPerson[]>((resolve, reject) => {
      let response = new Array<DisplayPerson>();
      let done = false;
      con.query("CALL DisplayAllEmployeeCurrents()", (err, rows) => {
        console.log(rows);
        let place = -1;
        for (let row of rows[0]) {
          place += 1;
          console.log("row: " + row);
          let dp = {
            name: row.IndividualName,
            company: row.CompanyName,
            position: row.PositionName,
            hyperlink: row.LinkedInUrl,
            comment: row.Comments
          };
          response[place] = dp;
        }
        this.end_connection(con);
        resolve(response);
      });
    });
  }
  //Papaparse gives (maps?) with fields: Name,Position, Employment Term, etc.
  createCallForCSV(entry): string {
    let name: String = entry["Name"];
    if (name.length < 1) {
      return null;
    }
    let firstPosition = entry["Portfolio Company Position"];
    let position = entry["New Position"];
    let employer = entry["New Employer"];
    let term = entry["Employment Term"];
    term = this.convertDates(term);
    let sterm = "";
    let eterm = "";
    if (term != null) {
      sterm = term[0];
      eterm = term[1];
    }
    let url = entry["Hyperlink Url"];
    let comments = entry["Comments"];
    let call = `CALL ImportFromCvsLine("${name}","${firstPosition}","${sterm}","${eterm}","${employer}","${position}","${url}","${comments}")`;
    //console.log(call);
    console.log(entry);
    return call;
  }
  convertDates(dates: String): string[] {
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
    let a = this.convertMY(start);
    let b = this.convertMY(end);
    if (a == null || b == null) {
      console.log("date cannot be read, may be a problem with the month");
      return null;
    }
    answer = [a, b];
    return answer;
  }
  convertMY(line: string): string {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let s = line.split(" ");
    let mi = months.indexOf(s[0]) + 1;
    if (mi == 0) mi = monthsAbbr.indexOf(s[0]) + 1;
    if (mi == 0) return null;
    let mis = String(mi);
    if (mis.length == 1) mis = "0" + mi;
    return `${s[s.length - 1]}-${mis}-01`;
  }

  async check_connection(): Promise<boolean> {
    let con = await this.create_connection_to_database();
    return new Promise<boolean>((resolve, reject) => {
      con.query("SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'heroku_2396736b79200ba'", (err, rows) => {
        if (err) {
          this.end_connection(con);
          reject(err);
        }
        this.end_connection(con);
        resolve(true);
      });
    });
  }

  end_connection(con) {
    console.log("attempt to close connection");
    con.end();
  }
}
