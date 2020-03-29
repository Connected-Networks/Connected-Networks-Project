import { Change } from "./UpdatesController";

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

  static async notifyOfChanges(changes: Change[]) {
    const users = NotificationController.getUsersToNotify(changes);
    await NotificationController.notifyUsers(users, changes);
  }

  static getUsersToNotify(changes: Change[]): User[] {
    throw new Error("Method not implemented.");
  }

  static async notifyUsers(users: User[], changes: Change[]) {
    const mailOptions = NotificationController.getMailOptions(users, changes);

    const info = await NotificationController.transporter.sendMail(mailOptions);

    console.log(info);
  }

  static getMailOptions(users: User[], changes: Change[]) {
    return {
      from: "Connected Networks Notifications <ConnectedNetworksNodeMailer@gmail.com>",
      to: NotificationController.getToString(users),
      subject: "New Changes Detected",
      html: NotificationController.getHtmlString(changes)
    };
  }

  static getToString(users: User[]): string {
    let toString = "";
    for (const user of users) {
      toString += `${user.username} <${user.email}>, `; //Nodemailer simply ignores the last comma
    }
    return toString;
  }

  static getHtmlString(changes: Change[]): string {
    let htmlString = "<ul>";
    for (const change of changes) {
      htmlString += NotificationController.getChangeHtmlString(change);
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
