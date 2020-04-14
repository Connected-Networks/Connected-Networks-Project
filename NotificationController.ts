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
      pass: "Yf%#RX]R7q4n[X{~",
    },
  });

  private static usernameToEmail: Map<string, string> = new Map();

  static async notify(changes: Change[]) {
    const usersToChanges = await this.mapUsersToChanges(changes);
    console.log(usersToChanges);

    for (const username of Array.from(usersToChanges.keys())) {
      const user = { username, email: this.usernameToEmail.get(username) };
      await this.notifyUser(user, usersToChanges.get(user.username));
    }
  }

  static async mapUsersToChanges(changes: Change[]): Promise<Map<string, Change[]>> {
    const usersToChanges = new Map<string, Change[]>();

    for (const change of changes) {
      const users = await this.getUsersToNotify(change);
      this.addUsersAndChanges(usersToChanges, users, change);
    }

    return usersToChanges;
  }

  static async getUsersToNotify(change: Change): Promise<User[]> {
    const users = await database.getAllUsersRelatedToFund(change.employee.fundId);

    return users.map((user) => ({ username: user.Username, email: user.Email }));
  }

  private static addUsersAndChanges(usersToChanges: Map<string, Change[]>, users: User[], change: Change) {
    for (const user of users) {
      if (!usersToChanges.has(user.username)) {
        usersToChanges.set(user.username, []);
        this.usernameToEmail.set(user.username, user.email);
      }
      usersToChanges.get(user.username).push(change);
    }
  }

  static async notifyUser(user: User, changes: Change[]) {
    const mailOptions = await this.getMailOptions(user, changes);

    const info = await this.transporter.sendMail(mailOptions);

    console.log(info);
  }

  static async getMailOptions(user: User, changes: Change[]) {
    return {
      from: "Connected Networks Notifications <ConnectedNetworksNodeMailer@gmail.com>",
      to: `${user.username} <${user.email}>`,
      subject: "New Changes Detected",
      html: await this.getHtmlString(changes),
    };
  }

  static async getHtmlString(changes: Change[]) {
    let htmlString = "<ul>";
    for (const change of changes) {
      htmlString += await this.getChangeHtmlString(change);
    }
    htmlString += "</ul>";
    return htmlString;
  }

  static async getChangeHtmlString(change: Change) {
    let changeString = "";
    changeString += "<li>";
    changeString += `<a href="${change.employee.linkedInUrl}">${change.employee.name}</a> (
      ${await this.getFundName(change.employee.fundId)}
      )`;
    changeString += ` moved from ${change.from.company} (${change.from.position})`;
    changeString += ` to ${change.to.company} (${change.to.position})`;
    changeString += "</li>";
    return changeString;
  }

  static async getFundName(fundId) {
    return await database.retrieveFundName(fundId);
  }
}
