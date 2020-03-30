import NotificationController from "./NotificationController";
const database = require("./sequelizeDatabase/sequelFunctions");

interface Update {
  linkedInUrl: string;
  company: string;
  position: string;
}

export interface Change {
  employee: Person;
  from: Employment;
  to: Employment;
}

interface Employment {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
}

interface Person {
  name: string;
  fundId: string;
  linkedInUrl: string;
}

export default class UpdatesController {
  static async receiveUpdates(req, res) {
    const { updates } = req.body;
    const changes = await UpdatesController.detectChanges(updates);
    if (changes.length > 0) {
      NotificationController.notify(changes);
    }
  }

  static async detectChanges(updates: Update[]): Promise<Change[]> {
    const changes = [];

    for (const update of updates) {
      const employee = await database.getIndividualByLinkedIn(update.linkedInUrl);
      const currentEmployment = await UpdatesController.getCurrentEmployment(employee.IndividualID);

      if (update.company !== currentEmployment.company || update.position !== currentEmployment.position) {
        const change = await UpdatesController.getChangeObject(employee, currentEmployment, update);
        changes.push(change);
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
      endDate: foundCurrentEmployment.EndDate
    };

    return currentEmployment;
  }

  static async getChangeObject(changedEmployee, currentEmployment: Employment, update: Update) {
    const employee: Person = {
      name: changedEmployee.Name,
      fundId: changedEmployee.FundID,
      linkedInUrl: changedEmployee.LinkedInUrl
    };

    const from: Employment = { ...currentEmployment, endDate: UpdatesController.getTodaysDate() };
    const to: Employment = { ...update, startDate: UpdatesController.getTodaysDate() };

    return { employee, from, to };
  }

  static getTodaysDate(): string {
    return "6969-06-09";
  }
}
