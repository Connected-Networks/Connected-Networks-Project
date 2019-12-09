const mysql = require('mysql')
const papa = require('Papaparse')
const con = mysql.createConnection({
    //todo: replace later
    host: 'localhost',
    user: 'user',
    password: 'password',
})
con.connect((err)=>{
    if (err){
        console.log('Error connecting to database')
        return
    }
    console.log('Connection established')
})
//let input:string = ",,,,,,Periodic Updates for 2019 (Any Job Changes?),,,,\nName,Position,Employment Term,Current Employer,Position,Hyperlink Url,Q1 2019,Q2 2019,Q3 2019,Q4 2019,Comments\nStephen Schwarzman,Managing Investor,June-Dec 2017,The Blackstone Group,Co founder,https://www.linkedin.com/in/stephenschwarzman/,,\"Chairman, The Blackstone Group\",,,Would hire again at any point"
//processRawCSV(input)

interface DisplayPerson{
    name:String
    comment:String
}
export default class BackendProcessing{




processRawCSV(data:string){

    //First line is commented and ignored
    //Second line is treated as header
    var results = papa.parse("#"+data,{header:true,comments:"#"})
    results.data.forEach(element => {
        let pcall = this.createCallForCSV(element);
    });
}

retrievePeopleFromDatabase(){
    con.query('CALL <fill in later>',(err,rows) => {
        if (err) throw err
        let response:DisplayPerson[]
        rows[0].foreach(row=>{
            let dp:DisplayPerson;
            dp.name = row.name;
            //fill in lines
            dp.comment = row.comment;
            response.push(dp)
        })
    })
}
//Papaparse gives (maps?) with fields: Name,Position, Employment Term, etc.
createCallForCSV(person){
    let name = person.Name
    let position = person.Position
    let term = person['Current Employer']
    let call = 'CALL <fill in later>'


}







}