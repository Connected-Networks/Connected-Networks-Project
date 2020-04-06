import PeopleController from "./PeopleController";
const database = require("./sequelizeDatabase/sequelFunctions");

export interface DisplayCompany {
  id: number;
  fundID: number;
  name: string;
}

export default class CompaniesController {
  static async getCompanies(req, res) {
    try {
      let userID = req.user.UserID;
      const companies = await this.getCompaniesFromDatabase(userID);
      res.send({ data: companies });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async getCompaniesFromDatabase(userID): Promise<DisplayCompany[]> {
    const companies = database.getAllCompaniesOfUser(userID);

    return companies.map((element) => {
      let company: DisplayCompany = {
        id: element.CompanyID,
        fundID: element.FundID,
        name: element.CompanyName,
      };
      return company;
    });
  }

  static async updateCompany(req, res) {
    try {
      let company = req.body;
      let userID = req.user.UserID;
      let fundID = company.FundID;

      if (!(await PeopleController.userCanChangeFund(userID, fundID))) {
        console.error("user is not authorized to change companies in that fund");
        res.sendStatus(500);
        return;
      }

      await database.modifyCompany(company.id, company.name);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async addCompany(req, res) {
    try {
      let company = req.body.newData;
      let userID = req.user.UserID;
      let fundID = company.FundID;

      if (!(await PeopleController.userCanChangeFund(userID, fundID))) {
        console.error("user cannot add a company to that fund");
        res.sendStatus(500);
        return;
      }
      await database.insertCompany(company.name);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  static async deleteCompany(req, res) {
    try {
      let company = req.params.id;
      let userID = req.user.UserID;
      let fundID = company.FundID;

      if (!(await PeopleController.userCanChangeFund(userID, fundID))) {
        console.error("user cannot delete a company from that fund");
        res.sendStatus(500);
        return;
      }
      await database.deleteCompany(company.id);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
}
