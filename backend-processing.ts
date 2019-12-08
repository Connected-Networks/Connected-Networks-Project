
const mysql = require('mysql')
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
let input:String = ",,,,,,Periodic Updates for 2019 (Any Job Changes?),,,,\nName,Position,Employment Term,Current Employer,Position,Hyperlink Url,Q1 2019,Q2 2019,Q3 2019,Q4 2019,Comments\nStephen Schwarzman,Managing Investor,June-Dec 2017,The Blackstone Group,Co founder,https://www.linkedin.com/in/stephenschwarzman/,,\"Chairman, The Blackstone Group\",,,Would hire again at any point"
processRawCSV(input)


function processRawCSV(data:String){
    let dataLines:String[] = extractNonheaderLines(data)
    let people:CSVPerson[] = new CSVPerson[dataLines.length]
    dataLines.forEach(element => {
        let person = new CSVPerson(element)
        people.push(person)
        console.log(person.basicDetails())
        let q = person.procedureString()
        con.query("CALL "+q,function(err){
            if (err)
                console.log('Error sending data to database')
        })
    });
}
function extractNonheaderLines(data:String):String[]{
    let lineSeparator = '/n'
    let headerLines = 2;
    let lines:String[] = data.split(lineSeparator);
    lines = lines.slice(2)
    return lines;
}
function retrievePeopleFromDatabase():DisplayPerson[]{





    return null
}







class CSVPerson{
    toProcess:String

    name:String
    position:String
    employmentTerm:String
    currentEmployer:String
    //represents past relation
    pastPosition:String
    link:String
    update1:String
    update2:String
    update3:String
    update4:String
    comment:String


    public constructor(data:String){
        this.toProcess = data
        this.ExtractFields()
    }
    private ExtractFields(){
        this.name = this.getNextValue()
        this.position = this.getNextValue()
        this.employmentTerm = this.getNextValue()
        this.currentEmployer = this.getNextValue()
        this.pastPosition = this.getNextValue()
        this.link = this.getNextValue()
        this.update1 = this.getNextValue()
        this.update2 = this.getNextValue()
        this.update3 = this.getNextValue()
        this.update4 = this.getNextValue()
        this.comment = this.getNextValue()
    }
    private getNextValue():String{
        let boxSeparator = ','
        let nextValue = ""
        let inQuotes = false
        let done = false
        while (this.toProcess.length>0 && !done){
            let c = this.toProcess.slice(0,1)
            this.toProcess = this.toProcess.slice(1)
            if (c=='"')
                inQuotes = !inQuotes
            else if (c==boxSeparator && !inQuotes)
                done = true
            else
                nextValue = nextValue + c
        }
        return nextValue
    }
    public basicDetails():String{
        let details = this.name + " : " + this.position
        if (this.comment.length>0)
            details += "("+this.comment+")"
        return details
    }
    public procedureString():String{
        //TODO: fill in method to match procedure syntax
        return ""
    }

}

class DisplayPerson{

}

