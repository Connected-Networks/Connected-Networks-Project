//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed
//Only temporary and will removed later

import NotificationController from "./NotificationController";

const users = [{ username: "mtbaqer", email: "mtbaqer@gmail.com" }];

const employee = { name: "Bill Gates", fund: "fund1", hyperlink: "https://www.linkedin.com/in/williamhgates" };
const from = { company: "Microsoft", position: "Co-founder", startingDate: "1975", endingDate: "2019" };
const to = { company: "Bill & Melinda Gates Foundation", position: "Co-chair", startingDate: "1975", endingDate: undefined };

const changes = [{ employee, from, to }];

// console.log(NotificationController.getHtmlString(changes));

NotificationController.notifyUsers(users, changes);
