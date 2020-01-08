const express = require("express");
const path = require("path");
const papa = require("papaparse");
const app = express();
import BackendProcessing from "./backend-processing"
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/csv", (req, res) => {
  try {
    let data = req.body.data
    let be = new BackendProcessing()
    be.processRawCSV(data)
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/people",(req,res)=>{
  try {
    let be = new BackendProcessing()
    let data = be.retrievePeopleFromDatabase().then(results=>{
      if (!results){
        res.sendStatus(500)
      }
      else{
        res.json({data:results})
        res.sendStatus(200)
      }
    })
  }
  catch (error){
    console.log(error)
    res.sendStatus(500)
  }
  
})


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
