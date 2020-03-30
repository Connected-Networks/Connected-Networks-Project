import { Change } from "./UpdatesController";
const database = require("./sequelizeDatabase/sequelFunctions");

export interface User {
  username: string;
  email: string;
}

const nodemailer = require("nodemailer");

export default class NotificationController {
  private static transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ConnectedNetworksNodeMailer@gmail.com",
      pass: "Yf%#RX]R7q4n[X{~"
    }
  });

  static async notify(changes: Change[]) {
    const usersToChanges = await this.mapUsersToChanges(changes);
    for (const [user, changes] of usersToChanges) {
      await this.notifyUser(user, changes);
    }
  }

  static async mapUsersToChanges(changes: Change[]): Promise<Map<User, Change[]>> {
    const usersToChanges = new Map<User, Change[]>();
    for (const change of changes) {
      const users = await this.getUsersRelatedToChange(change);
      this.addUsersAndChanges(usersToChanges, users, change);
    }
    return usersToChanges;
  }

  private static addUsersAndChanges(usersToChanges: Map<User, Change[]>, users: User[], change: Change) {
    return;
  }

  static async getUsersRelatedToChange(change: Change): Promise<User[]> {
    return null;
  }

  static async notifyUser(user: User, changes: Change[]) {
    const mailOptions = this.getMailOptions(user, changes);

    const info = await this.transporter.sendMail(mailOptions);

    console.log(info);
  }

  static getMailOptions(user: User, changes: Change[]) {
    return {
      from: "Connected Networks Notifications <ConnectedNetworksNodeMailer@gmail.com>",
      to: `${user.username} <${user.email}>`,
      subject: "New Changes Detected",
      html: this.getHtmlString(changes)
    };
  }

  static getHtmlString(changes: Change[]): string {
    let htmlString = "<ul>";
    for (const change of changes) {
      htmlString += this.getChangeHtmlString(change);
    }
    htmlString += "</ul>";
    return htmlString;
  }

  static getChangeHtmlString(change: Change) {
    let changeString = "";
    changeString += "<li>";
    changeString += `<a href="${change.employee.linkedInUrl}">${change.employee.name}</a> (${change.employee.fund})`;
    changeString += ` moved from ${change.from.company} (${change.from.position})`;
    changeString += ` to ${change.to.company} (${change.to.position})`;
    changeString += "</li>";
    return changeString;
  }
}
