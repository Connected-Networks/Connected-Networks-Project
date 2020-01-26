//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed

import BackendProcessing from './backend-processing'
const db = require('./sequelizeDatabase/sequelFunctions')


function test_connect_to_database(){
    let input:string = ",,,,,,Periodic Updates for 2019 (Any Job Changes?),,,,\nName,Position,Employment Term,Current Employer,Position2,Hyperlink Url,Q1 2019,Q2 2019,Q3 2019,Q4 2019,Comments\nStephen Schwarzman,Managing Investor,June-Dec 2017,The Blackstone Group,Co founder,https://www.linkedin.com/in/stephenschwarzman/,,\"Chairman, The Blackstone Group\",,,Would hire again at any point"
    let be = new BackendProcessing()
    be.processRawCSV(input)
    //be.end_connection()
}

function test_date_parser(){
    let input = "June-December 2017"
    let be = new BackendProcessing()
    let answer = be.convertDates(input)
    //be.end_connection()
    console.log(answer)
}

function test_retrieve_from_database(){
    let be = new BackendProcessing()
    be.retrievePeopleFromDatabase().then(result=>{
    console.log("result: "+result)
    //be.end_connection()
    })
}

//this test was created after experiencing drops from Heroku
async function test_continuous_connection(){
    let be = new BackendProcessing()
    let wait = 50
    console.log("testing connection with increasing wait time")
    let b = true
    while (b){
        b = (await check_connection_once(be))
        wait+=1
        console.log("wait: "+String(wait) + " seconds")
        await delay(wait*1000)
    }
}
async function check_connection_once(be:BackendProcessing):Promise<boolean>{
    return new Promise<boolean>((resolve,reject)=>{
        let p = test_connection()
        p.then(b=>{
            if (b){
                console.log("successful connection")
                resolve(true)
            }
            else{
                console.log("no successul connection")
                resolve(false)
            }
        })
        p.catch(err=>{
            console.log("error from database: "+String(err))
            resolve(false)
        })
    })
}

function delay(ms: number)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test_connection():Promise<Boolean>{
    return new Promise<Boolean>((resolve,reject)=>{
        db.getAllIndividuals().then(result=>{
            if (result!=null)
                resolve(true)
            else
                resolve(false)
        })
    })
}

function call_retrieve_people(){
    let be = new BackendProcessing()
    be.retrievePeopleFromDatabase().then(result=>{
        console.log(result)
    })
}

function test_sequelize_database_access(){
    db.getAllIndividuals().then((rows)=>{
        rows.forEach(element => {
           console.log(JSON.stringify(element)) 
        });
    })
}

//test_sequelize_database_access()
test_continuous_connection()