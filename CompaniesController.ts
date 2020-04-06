import BackendProcessing from "./backend-processing";
import PeopleController from "./PeopleController";

const database = require("./sequelizeDatabase/sequelFunctions");

export default class CompaniesController {
  static async getCompanies(req, res) {
    try {
      let be = new BackendProcessing();
      let userID = req.user.UserID;
      let data = be.retrieveCompaniesFromDatabase(userID).then((results) => {
        if (!results) {
          res.sendStatus(500);
        } else {
          res.json({ data: results });
        }
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async updateCompany(req, res) {
    //update company
    let be = new BackendProcessing();
    let company = req.body;
    let userID = req.user.UserID;
    let fundID = company.FundID;
    PeopleController.userCanChangeFund(userID, fundID).then((authorized) => {
      if (!authorized) {
        console.error("user is not authorized to change companies in that fund");
        res.sendStatus(500);
        return;
      }
      let update = be.update_company(company);
      update.then((boolean) => {
        if (boolean) {
          console.log("company updated");
          res.sendStatus(200);
        } else res.sendStatus(500);
      });
      update.catch(() => {
        res.sendStatus(500);
      });
    });
  }

  static async addCompany(req, res) {
    //add company
    let be = new BackendProcessing();
    let company = req.body.newData;
    let userID = req.user.UserID;
    let fundID = company.FundID;
    PeopleController.userCanChangeFund(userID, fundID).then((authorized) => {
      if (!authorized) {
        console.error("user cannot add a company to that fund");
        res.sendStatus(500);
        return;
      }
      let i = be.insert_company(company);
      i.then((boolean) => {
        if (boolean) {
          console.log("person added");
          res.sendStatus(200);
        } else res.sendStatus(500);
      });
      i.catch(res.sendStatus(500));
    });
  }

  static async deleteCompany(req, res) {
    //delete company
    let be = new BackendProcessing();
    let company = req.params.id;
    let userID = req.user.UserID;
    let fundID = company.FundID;
    PeopleController.userCanChangeFund(userID, fundID).then((authorized) => {
      if (!authorized) {
        console.error("user cannot delete a company from that fund");
        res.sendStatus(500);
        return;
      }
      let d = be.delete_company(company);
      d.then((boolean) => {
        if (boolean) res.sendStatus(200);
        else res.sendStatus(500);
      });
      d.catch(res.sendStatus(500));
    });
  }
}
