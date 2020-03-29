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
  fund: string;
  linkedInUrl: string;
}

export default class UpdatesController {
  static async receiveUpdates(req, res) {
    const { updates } = req.body;
    const changes = await UpdatesController.detectChanges(updates);
    if (changes.length > 0) {
      NotificationController.notifyOfChanges(changes);
    }
  }

  static async detectChanges(updates: Update[]): Promise<Change[]> {
    const changes = [];

    for (const update of updates) {
      const employee = await database.getIndividualByLinkedIn(update.linkedInUrl);
      const currentEmployment = await UpdatesController.getCurrentEmployment(employee.IndividualID);

      if (update.company !== currentEmployment.company || update.position !== currentEmployment.position) {
        changes.push(UpdatesController.getChangeObject(employee, currentEmployment, update));
      }
    }

    return changes;
  }

  static async getCurrentEmployment(id: string) {
    const foundCurrentEmployment = await database.getIndividualCurrentEmployement(id);
    const currentCompany = await database.getCompanyById(foundCurrentEmployment.CompanyID);

    const currentEmployment: Employment = {
      company: currentCompany.CompanyName,
      position: foundCurrentEmployment.PositionName,
      startDate: foundCurrentEmployment.StartDate,
      endDate: foundCurrentEmployment.EndDate
    };

    return currentEmployment;
  }

  static getChangeObject(employee, currentEmployment: Employment, update: Update): Change {
    return null;
  }
}
