//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed

import BackendProcessing from './backend-processing'



function connect_to_database(){
    let input:string = ",,,,,,Periodic Updates for 2019 (Any Job Changes?),,,,\nName,Position,Employment Term,Current Employer,Position,Hyperlink Url,Q1 2019,Q2 2019,Q3 2019,Q4 2019,Comments\nStephen Schwarzman,Managing Investor,June-Dec 2017,The Blackstone Group,Co founder,https://www.linkedin.com/in/stephenschwarzman/,,\"Chairman, The Blackstone Group\",,,Would hire again at any point"
    let be = new BackendProcessing()
    be.processRawCSV(input)
    be.end_connection()
}
