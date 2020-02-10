//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed

import BackendProcessing from './backend-processing'
const db = require('./sequelizeDatabase/sequelFunctions')


function test_date_parser(){
    let input = "June-December 2017"
    let be = new BackendProcessing()
    let answer = be.convertDates(input)
    //be.end_connection()
    console.log(answer)
}

function delay(ms: number)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

function test_company_functions(){
    let be = new BackendProcessing();
    let f = be.retrieveCompaniesFromDatabase();
    f.then((results)=>{
        console.log(results);
        })
    f.catch(()=>{console.log("error")})
}

//test_company_functions();
//console.log((new Date()).getFullYear())