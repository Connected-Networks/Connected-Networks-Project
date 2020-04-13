//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed

import BackendProcessing from "./backend-processing";
const db = require("./sequelizeDatabase/sequelFunctions");

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function test_new_function() {}
test_new_function();
