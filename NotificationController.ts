const nodemailer = require("nodemailer");

interface Change {
  employee: Person;
  from: EmploymentHistory;
  to: EmploymentHistory;
}

interface EmploymentHistory {
  company: string;
  position: string;
  startingDate: string;
  endingDate: string;
}

interface Person {
  name: string;
  fund: string;
  hyperlink: string;
}

interface User {
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

  static sendEmail() {
    NotificationController.transporter.sendMail(NotificationController.mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(info);
    });
  }

  static notifyUsers(users: User[], changes: Change[]) {}
}
