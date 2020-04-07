import BackendProcessing from "./backend-processing";
import PeopleController from "./PeopleController";
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

  static async updateFund(req, res) {
    let be = new BackendProcessing();
    console.log("Adding fund: " + req.body.newFundName + " to the database");
    let fund = req.body.newFundName;
    this.insert_fund(fund).then((result) => {
      if (result) res.sendStatus(200);
      else res.sendStatus(500);
    });
  }

  //returns a promise boolean representing if the operation was successful
  static insert_fund(fundName): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let i = database.insertFund(fundName);
      i.then(resolve(true));
      i.catch(resolve(false));
    });
  }

  static async addFund(req, res) {
    //Todo for Aaron, implement this function so it updates an existing fund, the fund can be accessed by req.body.fund,
    //req.body.fund.name is probably gonna be the thing that always change
    //Temp until function is implemented
    let be = new BackendProcessing();
    let userID = req.user.UserID;
    PeopleController.userCanChangeFund(userID, req.body.fund.id).then((authorized) => {
      if (!authorized) {
        console.error("User cannot update the fund");
        res.sendStatus(500);
        return;
      }
      console.log("Updated fund with id: " + req.body.fund.id + " to be called: " + req.body.fund.name);
      let fund = req.body.fund;
      this.update_fund(fund).then((result) => {
        if (result) res.sendStatus(200);
        else res.sendStatus(500);
      });
    });
  }

  static update_fund(fund): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      let u = database.modifyFund(fund.id, fund.name);
      u.then(resolve(true));
      u.catch(resolve(false));
    });
  }

  static async getCompaniesOfFund(req, res) {
    try {
      let be = new BackendProcessing();
      let userID = req.user.UserID;
      let fundID = req.params.id;
      be.userSeesFund(userID, fundID).then((authorized) => {
        if (!authorized) {
          console.error("User " + userID + " cannot see Fund " + fundID);
          res.sendStatus(500);
          return;
        }
        //console.log("params: " + JSON.stringify(req.params));
        //console.log("type: " + typeof fundID);
        //console.log("string: " + fundID);
        let data = be.retrieveCompaniesFromFund(fundID).then((results) => {
          if (results != null) {
            res.json({ data: results });
          } else res.sendStatus(500);
        });
      });
    } catch (error) {
      res.sendStatus(500);
    }
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
