const nodemailer = require("nodemailer");

export interface Change {
  employee: Person;
  from: EmploymentHistory;
  to: EmploymentHistory;
}

export interface EmploymentHistory {
  company: string;
  position: string;
  startingDate: string;
  endingDate: string;
}

export interface Person {
  name: string;
  fund: string;
  hyperlink: string;
}

export interface User {
  username: string;
  email: string;
}

export default class NotificationController {
  static transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ConnectedNetworksNodeMailer@gmail.com",
      pass: "Yf%#RX]R7q4n[X{~"
    }
  });

  static mailOptions = {
    from: "Connected Networks Notifications <Test@gmail.com>",
    to: "Mohammad Baqer <baqermt@rose-hulman.edu>",
    subject: "Testing Testing",
    html: "<p>Your html here</p>"
  };

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
    return "<p>Your html here</p>";
  }
}
