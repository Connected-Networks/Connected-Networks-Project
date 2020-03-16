import { resolve } from "dns";

const denv = require("dotenv").config();
const mysql = require("mysql");
const papa = require("papaparse");
const database = require("./sequelizeDatabase/sequelFunctions");
const bcrypt = require("bcryptjs");

interface DisplayPerson {
  id: number;
  name: string;
  company: string;
  position: string;
  comment: string;
  hyperlink: string;
}
interface DisplayCompany {
  id: number;
  name: string;
}
interface DisplayFund {
  id: number;
  name: string;
}

export default class BackendProcessing {

  processRawCSV(data: string,fileName:string,userID) {
    //First line is commented and ignored
    //Second line is treated as header

    
    let fundName = fileName;

    var results = papa.parse("#" + data, {
      //Adding a # causes the parser to skip the first row, treat the second row as header
      header: true,
      comments: "#",
      beforeFirstChunk: function(chunk) {
        let fi = chunk.indexOf("\n");
        let si = chunk.indexOf("\n", fi + 1);
        let fs = chunk.substring(0, fi);
        let ms = chunk.substring(fi, si);
        let ls = chunk.substring(si, chunk.length);
        chunk = fs + ms.toLowerCase() + ls;
        console.log("chunk: " + chunk);
        return chunk;
      }
    });
    console.log(JSON.stringify(results));
    return new Promise((resolve, reject) => {
      database.insertFund(fundName, userID).then(fund => {
        return Promise.all(
          results.data.map(element => {
            if (element["name"] != null) this.call_from_csv_line(element, fund.FundID, userID);
          })
        ).then(() => {
          resolve(true);
        });
      });
    }).catch(error => {
      console.error("error in processRawCSV", error);
    });
  }

  //Papaparse creates JSON objects with fields: name,position, employment term, etc.
  //This function assumes that the header is the second line of the csv file, with data starting on the third line
  //This function converts all header strings to lowercase, so all retrievals use lowercase keys
  call_from_csv_line(entry, fundID, userID) {
    let name: String = entry["name"];
    if (name.length < 1) {
      return;
    }
    let firstCompany = entry["portfolio company"];
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
    database.insertFromCsvLine(
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
  }

  retrievePeopleFromDatabase(): Promise<DisplayPerson[]> {
    return new Promise<DisplayPerson[]>((resolve, reject) => {
      database.getAllIndividuals().then(individuals => {
        resolve(
          Promise.all(
            individuals.map(
              (individual): Promise<DisplayPerson> => {
                return this.processIndividualForDisplay(individual);
              }
            )
          )
        );
      });
    });
  }

  processIndividualForDisplay(individual): Promise<DisplayPerson> {
    return new Promise<DisplayPerson>((resolve, reject) => {
      database.getIndividualCurrentEmployement(individual.IndividualID).then(employment => {
        let dp = {
          id: individual.IndividualID,
          name: individual.Name,
          company: "",
          position: "",
          hyperlink: individual.LinkedInUrl,
          comment: individual.comments
        };
        if (employment != null) {
          dp.company = employment.company.CompanyName;
          dp.position = employment.PositionName;
        }
        resolve(dp);
      });
    });
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
      "December"
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

  //returns a promise boolean representing if the operation was successful
  insert_person(person) {
    return new Promise<boolean>((resolve, reject) => {
      let insert = database.insertPerson(person.name, person.position, person.hyperlink, person.comment);
      insert.then(person => {
        resolve(true);
      });
      insert.catch(error => {
        console.error(error);
        resolve(false);
      });
    });
  }

  //returns a promise boolean representing if the operation was successful
  update_person(person) {
    return new Promise<boolean>((resolve, reject) => {
      let update = database.modifyIndividual(person.id, person.name, person.position, person.hyperlink, person.comment);
      update.then(person => {
        resolve(true);
      });
      update.catch(error => {
        console.error(error);
        resolve(false);
      });
    });
  }

  //returns a promise boolean representing if the operation was successful
  delete_person(person) {
    return new Promise<boolean>((resolve, reject) => {
      console.log("starting deletion");
      let del = database.deleteIndividual(person);
      del.then(person => {
        resolve(true);
      });
      del.catch(error => {
        reject(false);
      });
    });
  }

  //returns a promise boolean representing if the operation was successful
  insert_company(company): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let i = database.insertCompany(company.name);
      i.then(resolve(true));
      i.catch(resolve(false));
    });
  }

  //returns a promise boolean representing if the operation was successful
  update_company(company): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let u = database.modifyCompany(company.id, company.name);
      u.then(resolve(true));
      u.catch(resolve(false));
    });
  }

  //returns a promise boolean representing if the operation was successful
  delete_company(company): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let d = database.deleteCompany(company.id);
      d.then(resolve(true));
      d.catch(resolve(false));
    });
  }

  //returns a promise boolean representing if the operation was successful
  retrieveCompaniesFromDatabase(): Promise<DisplayCompany[]> {
    return new Promise<DisplayCompany[]>((resolve, reject) => {
      database.getAllCompanies().then(results => {
        let list: DisplayCompany[] = results.map(element => {
          let company: DisplayCompany = {
            id: element.CompanyID,
            name: element.CompanyName
          };
          return company;
        });
        resolve(list);
      });
    });
  }

  //returns a promise boolean representing if the operation was successful
  insert_fund(fundName): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let i = database.insertFund(fundName);
      i.then(resolve(true));
      i.catch(resolve(false));
    });
  }

  //returns a promise boolean representing if the operation was successful
  update_fund(fund): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let u = database.modifyFund(fund.id, fund.name);
      u.then(resolve(true));
      u.catch(resolve(false));
    });
  }

  //returns a promise boolean representing if the operation was successful
  delete_fund(fund): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let d = database.deleteFund(fund.id);
      d.then(resolve(true));
      d.catch(resolve(false));
    });
  }

  //returns a promise boolean representing if the operation was successful
  retrieveFundsFromDatabase(): Promise<DisplayFund[]> {
    return new Promise<DisplayFund[]>((resolve, reject) => {
      database.getAllFunds().then(results => {
        let list: DisplayFund[] = results.map(element => {
          let fund: DisplayFund = {
            id: element.FundID,
            name: element.FundName
          };
          return fund;
        });
        resolve(list);
      });
    });
  }

  retrieveCompaniesFromFund(fundID) {
    return new Promise<DisplayCompany[]>((resolve, reject) => {
      database.retrieveCompaniesByFunds(fundID).then(results => {
        let list: DisplayCompany[] = results.map(element => {
          let company: DisplayCompany = {
            id: element.CompanyID,
            name: element.CompanyName
          };
          return company;
        });
        resolve(list);
      });
    });
  }
  retrievePeopleViaCompany(companyID): Promise<Object> {
    return database.retrieveCurrentEmployeesOfCompany(companyID);
  }

  //returns undefined if fundID is not found
  retrieveFundName(fundID): Promise<String> {
    return new Promise<String>((resolve, reject) => {
      database.retrieveFundName(fundID).then(result => {
        resolve(result);
      });
    });
  }

  retrievePeopleFromOriginalCompany(companyID): Promise<Object> {
    //TODO: complete this function
    //This function will be simpler after the schema changes
    return null;
  }

  usernameIsTaken(username: string) {
    return new Promise<boolean>(resolve => {
      database
        .getUserByUsername(username)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  emailIsTaken(email: string) {
    return new Promise<boolean>(resolve => {
      database
        .getUserByEmail(email)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  emailIsValid(email: string): boolean {
    const emailRegex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    return emailRegex.test(String(email).toLowerCase());
  }

  passwordIsValid(password: string): boolean {
    return password.length >= 6;
  }

  insertUser(email: string, username: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      database
        .insertUser(username, hashedPassword, email)
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  //For Testing purposes
  //TODO: Remove this once done.
  getAllUsers() {
    return new Promise((resolve, reject) => {
      database
        .getAllUsers()
        .then(users => resolve(users))
        .catch(() => reject());
    });
  }
}
