const denv = require('dotenv').config()
const mysql = require("mysql");
const papa = require("Papaparse");
let result = require('dotenv').config()
console.log(result)
console.log(`${process.env.DATABASE} ${process.env.HOST} ${process.env.USER} ${process.env.PASSWORD}`)
const con = mysql.createConnection({
  database: process.env.DATABASE,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD
});
con.connect(err => {
  if (err) {
    console.log("Error connecting to database");
    return;
  }
 console.log("Connection established");
});

interface DisplayPerson {
  name: String;
  comment: String;
}

export default class BackendProcessing {
  processRawCSV(data: string) {
    //First line is commented and ignored
    //Second line is treated as header
    var results = papa.parse("#" + data, { header: true, comments: "#" });
    results.data.forEach(element => {
      let pcall = this.createCallForCSV(element);
    });
  }

  retrievePeopleFromDatabase() {
    // con.query("CALL <fill in later>", (err, rows) => {
    //   if (err) throw err;
    //   let response: DisplayPerson[];
    //   rows[0].foreach(row => {
    //     let dp: DisplayPerson;
    //     dp.name = row.name;
    //     //fill in lines
    //     dp.comment = row.comment;
    //     response.push(dp);
    //   });
    // });
  }
  //Papaparse gives (maps?) with fields: Name,Position, Employment Term, etc.
  createCallForCSV(entry) {
    // let name = entry.Name;
    // let position = entry.Position;
    // let employer = entry["Current Employer"];
    // let term = entry["Employment Term"]
    // let call = `Recieved ${name} at ${employer} doing ${position} during ${term}`;
    // console.log(call);
    let call = 'SELECT * FROM individuals'
    con.query(call,(err,rows)=>{
      if (err)
        console.log('error from database: '+err)
      else
        console.log(rows)
    })
  }

  end_connection(){
    con.end()
  }
}
