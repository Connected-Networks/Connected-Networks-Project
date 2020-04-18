import NotificationController from "./NotificationController";
import HistoryController from "./HistoryController";
import * as moment from "moment";
const database = require("./sequelizeDatabase/sequelFunctions");

interface Update {
  linkedInUrl: string;
  fundName?: string | string[];
  company: string;
  position: string;
}

export interface Change {
  employee: Employee;
  from: Employment;
  to: Employment;
}

interface Employment {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
}

interface Employee {
  id: number;
  name: string;
  fundId: number;
  linkedInUrl: string;
}

export default class UpdatesController {
  static async receiveUpdates(req, res) {
    try {
      if (!req.user) {
        res.sendStatus(401);
        return;
      }

      const updates: Update[] = req.body.updates;
      const changes = await UpdatesController.detectChanges(updates, req.user);

      if (changes.length > 0) {
        await HistoryController.applyChanges(changes);
        await NotificationController.notify(changes);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  static async detectChanges(updates: Update[], user: any): Promise<Change[]> {
    const changes = [];

    for (const update of updates) {
      const employees = await database.getIndividualsForUpdates(user.UserID, update.linkedInUrl, update.fundName);

      for (const employee of employees) {
        const currentEmployment = await UpdatesController.getCurrentEmployment(employee.IndividualID);

        if (update.company !== currentEmployment.company || update.position !== currentEmployment.position) {
          const change = await UpdatesController.getChangeObject(employee, currentEmployment, update);
          changes.push(change);
        }
      }
    }

    return changes;
  }

  static async getCurrentEmployment(id: string) {
    const foundCurrentEmployment = await database.getIndividualCurrentEmployement(id);
    //CurrentEmployment does not have a company name, only the id
    const currentCompany = await database.getCompanyById(foundCurrentEmployment.CompanyID);

    const currentEmployment: Employment = {
      company: currentCompany.CompanyName,
      position: foundCurrentEmployment.PositionName,
      startDate: foundCurrentEmployment.StartDate,
      endDate: foundCurrentEmployment.EndDate,
    };

    return currentEmployment;
  }

  static async getChangeObject(changedEmployee, currentEmployment: Employment, update: Update) {
    const employee: Employee = {
      id: changedEmployee.IndividualID,
      name: changedEmployee.Name,
      fundId: changedEmployee.FundID,
      linkedInUrl: changedEmployee.LinkedInUrl,
    };

    const from: Employment = { ...currentEmployment, endDate: UpdatesController.getTodaysDate() };
    const to: Employment = { ...update, startDate: UpdatesController.getTodaysDate() };

    return { employee, from, to };
  }

  static getTodaysDate(): string {
    return moment(new Date()).format("YYYY-MM-DD");
  }
}
