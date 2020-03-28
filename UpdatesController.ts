import NotificationController from "./NotificationController";

interface update {
  linkedInUrl: string;
  company: string;
  position: string;
}

export interface Change {
  employee: Person;
  from: EmploymentHistory;
  to: EmploymentHistory;
}

interface EmploymentHistory {
  company: string;
  position: string;
  startingDate: string;
  endingDate?: string;
}

interface Person {
  name: string;
  fund: string;
  hyperlink: string;
}

export interface User {
  username: string;
  email: string;
}

export default class UpdatesController {
  static async receiveUpdates(req, res) {
    const { updates } = req.body;
    const changes = await UpdatesController.detectChanges(updates);
    if (changes.length > 0) {
      NotificationController.notifyOfChanges(changes);
    }
  }

  static async detectChanges(updates: any): Promise<Change[]> {
    throw new Error("Method not implemented.");
  }
}
