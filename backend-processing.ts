import { resolve } from "dns";
import { start } from "repl";

const denv = require("dotenv").config();
const mysql = require("mysql");
const papa = require("papaparse");
const database = require("./sequelizeDatabase/sequelFunctions");

interface DisplayCompany {
  id: number;
  fundID: number;
  name: string;
}
interface DisplayFund {
  id: number;
  name: string;
}
interface DisplayHistory {
  id: number;
  company: string;
  position: string;
  start: string;
  end: string;
}
interface SimpleUser {
  id: number;
  username: string;
}

export default class BackendProcessing {
  processRawCSV(data: string, fileName: string, userID) {
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
  retrieveCompaniesFromDatabase(userID): Promise<DisplayCompany[]> {
    return new Promise<DisplayCompany[]>((resolve, reject) => {
      database.getAllCompaniesOfUser(userID).then(results => {
        console.log(JSON.stringify(results));
        let list: DisplayCompany[] = results.map(element => {
          let company: DisplayCompany = {
            id: element.CompanyID,
            fundID: element.FundID,
            name: element.CompanyName
          };
          return company;
        });
        console.log(JSON.stringify(list));
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
  retrieveFundsFromDatabase(userID): Promise<DisplayFund[]> {
    return new Promise<DisplayFund[]>((resolve, reject) => {
      database.getFundsUserCanSee(userID).then(availableFunds => {
        database.getAllFunds().then(results => {
          let list: DisplayFund[] = results.map(element => {
            let fund: DisplayFund = {
              id: element.FundID,
              name: element.FundName
            };
            return fund;
          });
          resolve(list.filter(x => availableFunds.indexOf(x.id.toString()) >= 0));
        });
      });
    });
  }

  retrieveCompaniesFromFund(fundID) {
    return new Promise<DisplayCompany[]>((resolve, reject) => {
      database.retrieveCompaniesByFunds(fundID).then(results => {
        let list: DisplayCompany[] = results.map(element => {
          let company: DisplayCompany = {
            id: element.CompanyID,
            fundID: element.FundID,
            name: element.CompanyName
          };
          return company;
        });
        resolve(list);
      });
    });
  }

  //Assumes that OriginalFundPosition table will not have duplicate combinations of IndividualID and CompanyID
  //If this assumption is wrong, this function may return duplicate entries
  retrievePeopleFromOriginalCompany(companyID): Promise<Object> {
    return new Promise<DisplayPerson[]>((resolve, reject) => {
      database
        .retrieveIndividualsByOriginalCompany(companyID)
        .then(results => {
          resolve(
            results.map(entry => {
              let dp: DisplayPerson = {
                id: entry.Individual.IndividualID,
                fundID: entry.Individual.FundID,
                name: entry.Individual.Name,
                //should not be needed. If it ever is, the db function could easily be edited to include companies table, at the cost of running time.
                company: null,
                position: entry.PositionName,
                comment: entry.Individual.Comments,
                hyperlink: entry.Individual.LinkedInUrl
              };
              return dp;
            })
          );
        })
        .catch(error => {
          console.error("Error in retrievePeopleViaOriginalCompany");
          console.error(error);
        });
    });
  }

  //returns undefined if fundID is not found
  retrieveFundName(fundID): Promise<String> {
    return new Promise<String>((resolve, reject) => {
      database.retrieveFundName(fundID).then(result => {
        resolve(result);
      });
    });
  }

  getHistoryOfIndividual(individualID): Promise<DisplayHistory[]> {
    return new Promise<DisplayHistory[]>((resolve, reject) => {
      database.getIndividualEmployeeHistory(individualID).then(results => {
        resolve(
          results.map(entry => {
            let history: DisplayHistory = {
              id: entry.id,
              company: entry.Company.CompanyName,
              position: entry.PositionName,
              start: entry.StartDate,
              end: entry.EndDate
            };
            return history;
          })
        );
      });
    });
  }

  insertHistory(history, individual, userID): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let fundID = individual.FundID;
      database
        .retrieveCompanyByName(history.company, fundID)
        .then(resultCompany => {
          database
            .insertEmployeeHistory(userID, history.id, resultCompany.CompanyID, history.position, history.start, history.end)
            .then(result => {
              if (result != null) resolve(true);
              else resolve(false);
            })
            .catch(error => {
              console.error("An error occurred while inserting employee history");
              console.error(error);
              resolve(false);
            });
        })
        .catch(error => {
          console.error("An error occurred while retrieving company information");
          console.error(error);
          resolve(false);
        });
    });
  }

  //The information passed into this function pertains to individuals, employeeHistory (except company ID), and company name
  //This function assumes that the individualID part of employeeHistory may change, but the details about the individual will not be changed here,
  //there is a seperate function for that. Similarly, this function assumes that the companyID may change, but the name of the specified company is not changing.
  updateHistory(history, individual, userID): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let fundID = individual.FundID;
      database
        .retrieveCompanyByName(history.company, fundID)
        .then(resultCompany => {
          database
            .updateHistory(
              history.HistoryID,
              userID,
              individual.IndividualID,
              resultCompany.CompanyID,
              history.position,
              history.start,
              history.end
            )
            .then(resolve(true));
        })
        .catch(error => {
          console.error("An error occurred while retrieving company information");
          console.error(error);
          resolve(false);
        });
    });
  }

  sharefund(fundID, user) {
    return new Promise<Boolean>((resolve, reject) => {
      database
        .sharefund(fundID, user.UserID)
        .then(result => {
          resolve(true);
        })
        .catch(error => {
          resolve(false);
        });
    });
  }

  getOtherUsers(currentUserID) {
    return new Promise<SimpleUser[]>((resolve, reject) => {
      database
        .getAllUsers()
        .then(users => {
          let filteredList = users.filter(user => {
            return user.UserID == currentUserID;
          });
          resolve(filteredList);
        })
        .catch(error => {
          reject(error);
        });
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

  userSeesFund(userID, fundID): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database
        .getFundsUserCanSee(userID)
        .then(fundList => {
          if (fundList.indexOf(fundID.toString()) > -1) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.error("an error occured while finding funds related to user " + userID);
        });
    });
  }

  userCanSeeIndividual(userID, individualID): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database.retrieveIndividualByID(individualID).then(individual => {
        let fundID = individual.FundID;
        return this.userSeesFund(userID, fundID);
      });
    });
  }
  userCanChangeIndividual(userID, individualID): Promise<boolean> {
    return new Promise((resolve, reject) => {
      database.retrieveIndividualByID(individualID).then(individual => {
        let fundID = individual.FundID;
        return this.userCanChangeFund(userID, fundID);
      });
    });
  }
}
