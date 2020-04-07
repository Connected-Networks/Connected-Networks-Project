import PeopleController from "./PeopleController";
import { RSA_NO_PADDING } from "constants";
import { DisplayCompany } from "./CompaniesController";
const database = require("./sequelizeDatabase/sequelFunctions");

interface DisplayFund {
  id: number;
  name: string;
}

export default class FundsController {
  static async getFunds(req, res) {
    //return type should be an Array of SideMenuFund objects as defined in App.tsx.
    try {
      let userID = req.user.UserID;
      let funds = await this.retrieveFundsFromDatabase(userID);
      res.send({ data: funds });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  //returns a promise boolean representing if the operation was successful
  static async retrieveFundsFromDatabase(userID): Promise<DisplayFund[]> {
    const fundIdsUserCanSee = await database.getFundsUserCanSee(userID);

    const allFunds = await database.getAllFunds();
    let list: DisplayFund[] = allFunds.map((element) => {
      let fund: DisplayFund = {
        id: element.FundID,
        name: element.FundName,
      };
      return fund;
    });

    return list.filter((x) => fundIdsUserCanSee.include(x.id.toString()));
  }

  static async addFund(req, res) {
    try {
      let fundName = req.body.newFundName;
      await database.insertFund(fundName);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async updateFund(req, res) {
    try {
      let userID = req.user.UserID;
      let fund = req.body.fund;

      if (!(await PeopleController.userCanChangeFund(userID, fund.id))) {
        console.error("User cannot update the fund");
        res.sendStatus(401);
        return;
      }
      await database.modifyFund(fund.id, fund.name);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async getCompaniesOfFund(req, res) {
    try {
      let userID = req.user.UserID;
      let fundID = req.params.id;

      if (!(await this.userSeesFund(userID, fundID))) {
        console.error("User " + userID + " cannot see Fund " + fundID);
        res.sendStatus(401);
        return;
      }

      const companies = await this.retrieveCompaniesFromFund(fundID);
      res.send({ data: companies });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async userSeesFund(userID, fundID): Promise<boolean> {
    const fundsUserCanSee = await database.getFundsUserCanSee(userID);

    return fundsUserCanSee.include(fundID.toString());
  }

  static async retrieveCompaniesFromFund(fundID) {
    const companies = await database.retrieveCompaniesByFunds(fundID);

    let list: DisplayCompany[] = companies.map((element) => {
      let company: DisplayCompany = {
        id: element.CompanyID,
        fundID: element.FundID,
        name: element.CompanyName,
      };
      return company;
    });

    return list;
  }

  //returns a promise boolean representing if the operation was successful
  static async delete_fund(fund): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let d = database.deleteFund(fund.id);
      d.then(resolve(true));
      d.catch(resolve(false));
    });
  }
}
