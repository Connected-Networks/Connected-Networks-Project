const database = require("./sequelizeDatabase/sequelFunctions");
import FundsController from "./FundsController";
import PeopleController from "./PeopleController";
import { Change } from "./UpdatesController";
import * as moment from "moment";

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
      console.log(error);
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
        id: entry.HistoryID,
        company: entry.company.CompanyName,
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

      if (!(await HistoryController.userCanChangeIndividual(userID, individual.id))) {
        console.error("User cannot add history to individual " + individual.id);
        res.sendStatus(401);
        return;
      }

      await HistoryController.addHistoryToDatabase(history, individual, userID);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  static async addHistoryToDatabase(history, individual, userID) {
    let fundID = individual.fundID;
    const company = await database.retrieveCompanyByName(history.company, fundID);

    if (!company) {
      throw new Error("Provided history has an invalid company");
    }

    await database.insertEmployeeHistory(userID, individual.id, company.CompanyID, history.position, history.start, history.end);
  }

  static async userCanChangeIndividual(userID, individualID): Promise<boolean> {
    const individual = await database.retrieveIndividualByID(individualID);
    let fundID = individual.FundID;
    return await PeopleController.userCanChangeFund(userID, fundID);
  }

  static async updateHistory(req, res) {
    try {
      let history = req.body.newData;
      let individual = req.body.employee;
      let userID = req.user.UserID;

      //console.log(history);

      if (!(await HistoryController.userCanChangeIndividual(userID, individual.id))) {
        console.error("User cannot edit history of individual " + individual.id);
        res.sendStatus(401);
        return;
      }
      await HistoryController.updateHistoryInDatabase(history, individual, userID);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  //The information passed into this function pertains to individuals, employeeHistory (except company ID), and company name
  //This function assumes that the individualID part of employeeHistory may change, but the details about the individual will not be changed here,
  //there is a seperate function for that. Similarly, this function assumes that the companyID may change, but the name of the specified company is not changing.
  static async updateHistoryInDatabase(history, individual, userID) {
    let fundID = individual.fundID;
    const company = await database.retrieveCompanyByName(history.company, fundID);
    if (!company) throw new Error("Cannot locate the company " + history.company);
    await database.updateEmployeeHistory(
      history.id,
      userID,
      individual.id,
      company.CompanyID,
      history.position,
      history.start,
      history.end
    );
  }

  static async deleteHistory(req, res) {
    try {
      let historyID = req.params.id;
      let individual = req.body.employee;
      let userID = req.user.UserID;

      if (!(await HistoryController.userCanChangeIndividual(userID, individual.id))) {
        console.error("User cannot edit history of individual " + individual.id);
        res.sendStatus(401);
        return;
      }
      await database.deleteEmployeeHistory(historyID);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  static async applyChanges(changes: Change[]) {
    for (const change of changes) {
      try {
        const { employee, to } = change;
        const company = await database.insertCompany(to.company, employee.fundId);
        const fundOwnerID = (await database.getFundById(employee.fundId)).UserID;

        const currentEmployment = await database.getIndividualCurrentEmployement(employee.id);
        if (currentEmployment) {
          await database.updateEmployeeHistory(
            currentEmployment.HistoryID,
            currentEmployment.UserID,
            currentEmployment.IndividualID,
            currentEmployment.CompanyID,
            currentEmployment.PositionName,
            currentEmployment.StartDate,
            moment(new Date()).format("YYYY-MM-DD")
          );
        }

        await database.insertEmployeeHistory(fundOwnerID, employee.id, company.CompanyID, to.position, to.startDate, to.endDate);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
