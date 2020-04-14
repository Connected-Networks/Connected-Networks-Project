//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed
//Only temporary and will removed later

const database = require("./sequelizeDatabase/sequelFunctions");

const main = async () => {
  const people = await database.getAllIndividuals();
};

main();
