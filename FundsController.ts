import PeopleController from "./PeopleController";
import { DisplayCompany } from "./CompaniesController";
import { RSA_NO_PADDING } from "constants";
const database = require("./sequelizeDatabase/sequelFunctions");

interface DisplayFund {
  id: number;
  name: string;
  shared: boolean;
}

export default class FundsController {
  static async getFunds(req, res) {
    //return type should be an Array of SideMenuFund objects as defined in App.tsx.
    try {
      let userID = req.user.UserID;
      let funds = await FundsController.getFundsFromDatabase(userID);
      res.send({ data: funds });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  //returns a promise boolean representing if the operation was successful
  static async getFundsFromDatabase(userID): Promise<DisplayFund[]> {
    const fundsOwnedByUser = await database.getFundsOwnedByUser(userID);
    const fundsSharedWithUser = await database.getFundsSharedWithUser(userID);

    return [...FundsController.mapFunds(fundsOwnedByUser, false), ...FundsController.mapFunds(fundsSharedWithUser, true)];
  }

  static mapFunds(funds, shared: boolean): DisplayFund[] {
    return funds.map((element) => ({
      id: element.FundID,
      name: element.FundName,
      shared,
    }));
  }

  static async updateFund(req, res) {
    try {
      let userID = req.user.UserID;
      let fund = req.body.newData;

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

      if (!(await FundsController.userSeesFund(userID, fundID))) {
        console.error("User " + userID + " cannot see Fund " + fundID);
        res.sendStatus(401);
        return;
      }

      const companies = await FundsController.getCompaniesFromFund(fundID);
      res.send({ data: companies });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async userSeesFund(userID, fundID): Promise<boolean> {
    const fundsUserCanSee = await database.getFundsUserCanSee(userID);

    return fundsUserCanSee.includes(fundID.toString());
  }

  static async getCompaniesFromFund(fundID) {
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

  static async addFund(req, res) {
    try {
      let newFundName = req.body.newData;
      let userID = req.user.UserID;
      await database.insertFund(newFundName, userID);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async deleteFund(req, res) {
    try {
      let fundID = req.params.id;
      let userID = req.user.UserID;

      if (!(await PeopleController.userCanChangeFund(userID, fundID))) {
        console.error("User cannot delete the fund");
        res.sendStatus(401);
        return;
      }

      await database.deleteFund(fundID);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async shareFund(req, res) {
    try {
      let fundID = req.body.fundId;
      let user = req.body.user;
      await database.sharefund(fundID, user.id);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async getUsersSharedWith(req, res) {
    try {
      const fundID = req.params.id;
      const userID = req.user.UserID;

      if (!(await FundsController.userSeesFund(userID, fundID))) {
        console.error("User " + userID + " cannot see Fund " + fundID);
        res.sendStatus(401);
        return;
      }

      const usersSharedWith = await database.getSharedWithUsers(fundID);
      const mappedUsers = usersSharedWith.map((user) => ({ username: user.Username }));

      res.send({ users: mappedUsers });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
}
