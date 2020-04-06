//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed
//Only temporary and will removed later

import UpdatesController, { Change } from "./UpdatesController";
import NotificationController from "./NotificationController";
const database = require("./sequelizeDatabase/sequelFunctions");
const models = require("./sequelizeDatabase/modelSetup");

const main = async () => {
  console.log(await database.getFundsUserCanChange(91));
};

models.sequelize.connect();
main();
