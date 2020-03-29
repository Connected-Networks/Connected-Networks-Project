//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed
//Only temporary and will removed later

import UpdatesController from "./UpdatesController";
const database = require("./sequelizeDatabase/sequelFunctions");

const main = async () => {
  const linkedInUrl = "https://www.linkedin.com/in/williamhgates/";
  const update = { linkedInUrl, company: "Joojle", position: "boss" };

  const employee = await database.getIndividualByLinkedIn(linkedInUrl);
  const currentEmployment = await UpdatesController.getCurrentEmployment(employee.IndividualID);
  const change = await UpdatesController.getChangeObject(employee, currentEmployment, update);
  console.log(change);
};
main();
