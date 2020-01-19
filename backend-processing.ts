
const denv = require("dotenv").config();
const mysql = require("mysql");
const papa = require("papaparse");
const models = require('./sequelizeDatabase/modelSetup');

interface DisplayPerson {
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

export default class BackendProcessing {

  async processRawCSV(data: string) {
    //First line is commented and ignored
    //Second line is treated as header
    var results = papa.parse("#" + data, {//Adding a # causes the parser to skip the first row, treat the second row as header
      header: true,
      comments: "#",
      beforeFirstChunk:function(chunk){
        let fi = chunk.indexOf("\n");
        let si = chunk.indexOf("\n",fi+1);
        let fs = chunk.substring(0,fi);
        let ms = chunk.substring(fi,si);
        let ls = chunk.substring(si,chunk.length);
        chunk = fs + ms.toLowerCase() + ls;
        console.log("chunk: "+chunk);
        return chunk;
      }});
    await results.data.forEach(element => {
      if (element["name"] != null) this.call_from_csv_line(element);
    });
  }

  async call_from_csv_line(element) {
    let pcall = this.createCallForCSV(element);
    if (pcall != null) {
      console.log(`Sending to db: ${pcall}`);
      // con.query(pcall, (err, rows) => {
      //   if (err) console.log("error from database: " + err);
      //   else console.log(rows);
      // });
    }
  }

  async retrievePeopleFromDatabase(): Promise<DisplayPerson[]> {
    return new Promise<DisplayPerson[]>((resolve, reject) => {
      let response = new Array<DisplayPerson>();
      let done = false;
      // con.query("CALL DisplayAllEmployeeCurrents()", (err, rows) => {
      //   console.log(rows);
      //   let place = -1;
      //   for (let row of rows[0]) {
      //     place += 1;
      //     console.log("row: " + row);
      //     let dp = {
      //       name: row.IndividualName,
      //       company: row.CompanyName,
      //       position: row.PositionName,
      //       hyperlink: row.LinkedInUrl,
      //       comment: row.Comments
      //     };
      //     response[place] = dp;
      //   }
      //   this.end_connection(con);
      //   resolve(response);
      // });
    });
  }
  //Papaparse creates JSON objects with fields: name,position, employment term, etc.
  //Assume all fields will be entirely lowercase
  createCallForCSV(entry): string {
    let name: String = entry["name"];
    if (name.length < 1) {
      return null;
    }
    let firstPosition = entry["portfolio company position"];
    let position = entry["new position"];
    let employer = entry["new employer"];
    let term = entry["employment term"];
    term = this.convertDates(term);
    let sterm = "";
    let eterm = "";
    if (term != null) {
      sterm = term[0];
      eterm = term[1];
    }
    let url = entry["hyperlink url"];
    let comments = entry["comments"];
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

  // async check_connection(): Promise<boolean> {
  //   let con = await this.create_connection_to_database();
  //   return new Promise<boolean>((resolve, reject) => {
  //     con.query("SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'heroku_2396736b79200ba'", (err, rows) => {
  //       if (err) {
  //         this.end_connection(con);
  //         reject(err);
  //       }
  //       this.end_connection(con);
  //       resolve(true);
  //     });
  //   });
  // }

}
