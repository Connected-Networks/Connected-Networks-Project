const database = require("./sequelizeDatabase/sequelFunctions");
import FundsController from "./FundsController";
import PeopleController from "./PeopleController";

interface DisplayHistory {
  id: number;
  company: string;
  position: string;
  start: string;
  end: string;
}

export default class HistoryController {
  static async getHistory(req, res) {
    try {
      let individualID = req.params.id;
      let userID = req.user.UserID;

      if (!(await HistoryController.userCanSeeIndividual(userID, individualID))) {
        console.error("User cannot see history of individual " + individualID);
        res.sendStatus(401);
        return;
      }
      let history = await HistoryController.getHistoryFromDatabase(individualID);
      res.send({ data: history });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async userCanSeeIndividual(userID, individualID): Promise<boolean> {
    const individual = await database.retrieveIndividualByID(individualID);
    let fundID = individual.FundID;
    return await FundsController.userSeesFund(userID, fundID);
  }

  static async getHistoryFromDatabase(individualID): Promise<DisplayHistory[]> {
    const history = await database.getIndividualEmployeeHistory(individualID);

    return history.map((entry) => {
      let history: DisplayHistory = {
        id: entry.id,
        company: entry.Company.CompanyName,
        position: entry.PositionName,
        start: entry.StartDate,
        end: entry.EndDate,
      };
      return history;
    });
  }

  static async addHistory(req, res) {
    try {
      let history = req.body.newData;
      let userID = req.user.UserID;
      let individual = req.body.employee;

      console.log(history);

      console.log(individual);
      if (!(await HistoryController.userCanChangeIndividual(userID, individual.id))) {
        console.log("11111111111111111");
        console.error("User cannot add history to individual " + individual.IndividualID);
        res.sendStatus(401);
        return;
      }
      console.log("2222222222222222");
      await HistoryController.addHistoryToDatabase(history, individual, userID);
      res.sendStatus(200);
      return;
    } catch (error) {
      console.log("4444444444444444444444444444");
      res.sendStatus(500);
      console.log("77777777777777777777777777");
    }
  }

  static async addHistoryToDatabase(history, individual, userID) {
    let fundID = individual.fundID;
    console.log("11111111111111111");
    const company = await database.retrieveCompanyByName(history.company, fundID);
    console.log("2222222222222222222222");
    if (!company) {
      console.log("555555555555555555555555555555555555");

      throw new Error();
    }
    console.log("3333333333333");
    await database.insertEmployeeHistory(userID, individual.id, company.CompanyID, history.position, history.start, history.end);
    console.log("444444444444444444444444444");
  }

  static async userCanChangeIndividual(userID, individualID): Promise<boolean> {
    console.log("8888888888888888888888888");
    const individual = await database.retrieveIndividualByID(individualID);
    let fundID = individual.FundID;
    console.log("99999999999999999999");
    return await PeopleController.userCanChangeFund(userID, fundID);
  }

  static async updateHistory(req, res) {
    try {
      let history = req.body;
      let individual = req.employee;
      let userID = req.user.UserID;

      if (!(await HistoryController.userCanChangeIndividual(userID, individual.individualID))) {
        console.error("User cannot edit history of individual " + individual.IndividualID);
        res.sendStatus(401);
        return;
      }
      await HistoryController.updateHistoryInDatabase(history, individual, userID);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  //The information passed into this function pertains to individuals, employeeHistory (except company ID), and company name
  //This function assumes that the individualID part of employeeHistory may change, but the details about the individual will not be changed here,
  //there is a seperate function for that. Similarly, this function assumes that the companyID may change, but the name of the specified company is not changing.
  static async updateHistoryInDatabase(history, individual, userID) {
    let fundID = individual.FundID;
    const company = await database.retrieveCompanyByName(history.company, fundID);

    await database.updateHistory(
      history.HistoryID,
      userID,
      individual.IndividualID,
      company.CompanyID,
      history.position,
      history.start,
      history.end
    );
  }
}
