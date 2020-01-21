import { resolve } from "dns";

const denv = require("dotenv").config();
const mysql = require("mysql");
const papa = require("papaparse");
const database = require('./sequelizeDatabase/sequelFunctions');

interface DisplayPerson {
  id: Int16Array;
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
    
    //Papaparse creates JSON objects with fields: name,position, employment term, etc.
    //Assume all fields will be entirely lowercase
    async call_from_csv_line(entry) {
      let name: String = entry["name"];
      if (name.length < 1) {
        return;
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
      database.insertFromCsvLine(name,firstPosition,sterm,eterm,employer,position,url,comments)
      //let call = `CALL ImportFromCvsLine("${name}","${firstPosition}","${sterm}","${eterm}","${employer}","${position}","${url}","${comments}")`;
  }

  async retrievePeopleFromDatabase(): Promise<DisplayPerson[]> {
    return new Promise<DisplayPerson[]>((resolve, reject) => {
      database.getAllIndividuals().then(async (individuals)=>{
        this.build_response_from_individuals(individuals).then((response)=>{
          resolve(response)
        })
      })
    });
  }
  async build_response_from_individuals(individuals):Promise<DisplayPerson[]>{
    return new Promise<DisplayPerson[]>(async (resolve,reject)=>{
      let response = new Array<DisplayPerson>();
      let place = 0;
      let remaining = individuals.length
      individuals.forEach((individual) => {
        this.processIndividualForDisplay(individual).then((dp)=>{
          response[place] = dp;
          place += 1;
          remaining --;
          if (remaining==0)
            resolve(response)
        })
      })
    })
  }
  async processIndividualForDisplay(individual):Promise<DisplayPerson>{
    return new Promise<DisplayPerson>((resolve,reject)=>{
      database.getIndividualCurrentEmployement(individual.IndividualID).then((employment)=>{
        console.log("employment: "+JSON.stringify(employment))
        let dp = {
          id: individual.IndividualID,
          name: individual.IndividualName,
          company: employment.company.CompanyName,
          position: employment.PositionName,
          hyperlink: individual.LinkedInUrl,
          comment: individual.comments
        }
        console.log("created entry: "+JSON.stringify(dp))
        resolve(dp)
      })
    })
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
