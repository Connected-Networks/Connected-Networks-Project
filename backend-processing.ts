import { resolve } from "dns";

const denv = require("dotenv").config();
const mysql = require("mysql");
const papa = require("papaparse");
const database = require('./sequelizeDatabase/sequelFunctions');

interface DisplayPerson {
  id: number;
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}

export default class BackendProcessing {

  processRawCSV(data: string) {
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
      console.log(JSON.stringify(results))
      return Promise.all(results.data.map((element)=>{if (element["name"]!=null) this.call_from_csv_line(element)}))
    }
    
    //Papaparse creates JSON objects with fields: name,position, employment term, etc.
    //This function assumes that the header is the second line of the csv file, with data starting on the third line
    //This function converts all header strings to lowercase, so all retrievals use lowercase keys
    call_from_csv_line(entry) {
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
  }

  retrievePeopleFromDatabase(): Promise<DisplayPerson[]> {
    return new Promise<DisplayPerson[]>((resolve, reject) => {
      database.getAllIndividuals().then((individuals)=>{
        resolve(Promise.all(individuals.map((individual):Promise<DisplayPerson>=>{
          return this.processIndividualForDisplay(individual)
        })))
      })
    });
  }

  processIndividualForDisplay(individual):Promise<DisplayPerson>{
    return new Promise<DisplayPerson>((resolve,reject)=>{
      database.getIndividualCurrentEmployement(individual.IndividualID).then((employment)=>{
        let dp = {
          id: individual.IndividualID,
          name: individual.IndividualName,
          company: "",
          position: "",
          hyperlink: individual.LinkedInUrl,
          comment: individual.comments
        }
        if (employment!=null){
          dp.company = employment.company.CompanyName;
          dp.position = employment.PositionName;
        }
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

  //returns a promise boolean representing if the operation was successful
  insert_person(person){
    return new Promise<boolean>((resolve,reject)=>{
      let insert = database.insertPerson(person.name,person.position,person.hyperlink,person.comment)
      insert.then((person)=>{
        resolve(true)
      })
      insert.catch((error)=>{
        console.error(error)
        resolve(false)
      })
    })
  }

  //returns a promise boolean representing if the operation was successful
  update_person(person){
    return new Promise<boolean>((resolve,reject)=>{
      let update = database.modifyIndividual(person.id,person.name,person.position,person.hyperlink,person.comment)
      update.then((person)=>{
        resolve(true)
      })
      update.catch((error)=>{
        console.error(error)
        resolve(false)
      })
    })
  }

  //returns a promise boolean representing if the operation was successful
  delete_person(person){
    return new Promise<boolean>((resolve,reject)=>{
      console.log("starting deletion")
      let del = database.deleteIndividual(person)
      del.then((person)=>{
        resolve(true);
      })
      del.catch((error)=>{
        reject(false);
      })
    })
  }
}
