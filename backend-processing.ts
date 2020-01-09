import { MysqlError } from "mysql";

const denv = require('dotenv').config()
const mysql = require("mysql");
const papa = require("Papaparse");
let result = require('dotenv').config()
//console.log(`${process.env.DATABASE},${process.env.HOST},${process.env.USER},${process.env.PASSWORD}`)
const con = mysql.createConnection({
  database: process.env.DATABASE,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD
});
con.connect(err => {
  if (err) {
    console.log("Error connecting to database");
    console.log(err)
    return;
  }
 console.log("Database connection established");
});

interface DisplayPerson {
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
    var results = papa.parse("#" + data, { header: true, comments: "#" });
    results.data.forEach(element => {
      let pcall = this.createCallForCSV(element);
      if (pcall!=null){
        console.log(`Sending to db: ${pcall}`)
        con.query(pcall,(err,rows)=>{
        if (err)
          console.log('error from database: '+err)
        else
          console.log(rows)
        })
      }
    });
  }

  async retrievePeopleFromDatabase():Promise<DisplayPerson[]> {
    return new Promise<DisplayPerson[]>((resolve,reject)=>{
      let response = new Array<DisplayPerson>();
      let done = false;
      con.query("CALL DisplayAllEmployeeCurrents()",(err,rows)=>{
      console.log(rows)
      let place = -1
      for (let row of rows[0]){
        place += 1
        console.log("row: "+row)
        let dp = {
        name : row.IndividualName,
        company : row.CompanyName,
        position : row.PositionName,
        hyperlink : row.LinkedInUrl,
        comment : row.Comments,
      }
        response[place] = dp;
      
      }
      resolve(response)})
    })
  }
  //Papaparse gives (maps?) with fields: Name,Position, Employment Term, etc.
  createCallForCSV(entry):string {
    let name : String = entry.Name;
    if (name.length<1){
      return null
    }
    let firstPosition = entry.Position;
    let position = entry.Position2;
    let employer = entry["Current Employer"];
    let term = entry["Employment Term"]
    let url = entry["Hyperlink Url"]
    let comments = entry["Comments"]
    term = this.convertDates(term)
    let sterm = term[0]
    let eterm = term[1]
    let call = `CALL ImportFromCvsLine("${name}","${firstPosition}","${sterm}","${eterm}","${employer}","${position}","${url}","${comments}")`;
    //console.log(call);
    console.log(entry)
    return call;
  }
  convertDates(dates:String):string[]{
    console.log(`Parsing date: ${dates}`)
    let answer:string[]
    let dcount = 0
    let dindex = -1
    for (let i=0;i<dates.length;i++){
      if (dates.charAt(i)=='-'){
        dcount+=1
        dindex = i
      }
    }
    if (dcount!=1){
      console.log("date cannot be read")
      return null
    }
    let start = dates.slice(0,dindex)
    let end = dates.slice(dindex+1)
    let se = start.slice(start.length-4)
    if (isNaN(Number(se)))
      start += ` ${end.slice(end.length-4)}`
    let a = this.convertMY(start)
    let b = this.convertMY(end)
    if (a==null || b == null){
      console.log("date cannot be read, may be a problem with the month")
      return null
    }
    answer = [a,b]
    return answer
  }
  convertMY(line:string):string{
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    let monthsAbbr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let s = line.split(" ")
    let mi = months.indexOf(s[0])+1
    if (mi==0)
      mi = monthsAbbr.indexOf(s[0])+1
    if (mi==0)
      return null
    let mis = String(mi)
    if (mis.length==1)
    mis = "0"+mi
    return `${s[s.length-1]}-${mis}-01`
  }





  end_connection(){
    console.log("attempt to close connection")
    con.end()
  }
}
