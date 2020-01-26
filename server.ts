const express = require("express");
const path = require("path");
const papa = require("papaparse");
const app = express();
import BackendProcessing from "./backend-processing";
import { rejects } from "assert";
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/csv", (req, res) => {
  try {
    let data = req.body.data;
    let be = new BackendProcessing();
    be.processRawCSV(data).then((results)=>{
      res.sendStatus(200);
    })
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/people", (req, res) => {
  try {
    let be = new BackendProcessing();
    console.log("starting retrieval")
    let data = be.retrievePeopleFromDatabase().then(results => {
      console.log("results 2: "+results)
      if (!results) {
        res.sendStatus(500);
      } else {
        res.json({ data: results });
        res.sendStatus(200);
      }
    });
  } catch (error) {
    console.log("error retrieving people: "+error);
    res.sendStatus(500);
  }
});

app.put("/people", (req, res) => {
  //update person
  let be = new BackendProcessing();
  //console.log("body: "+JSON.stringify(req.body))
  let person = req.body;
  let update = be.update_person(person);
  update.then((boolean) => {
    if (boolean)
      res.sendStatus(200);
    else
      res.sendStatus(500);
  });
  update.catch(() => {
    res.sendStatus(500);
  });
});

app.post("/people", (req, res) => {
  //add person
  let be = new BackendProcessing();
  let person = req.body.newData;
  let i = be.insert_person(person);
  i.then((boolean) => {
    if (boolean)
      res.sendStatus(200);
    else
      res.sendStatus(500);
  });
  i.catch(res.sendStatus(500));
});

app.delete("/people/:id", (req, res) => {
  //delete person
  let be = new BackendProcessing();
  let person = req.params.id;
  let d = be.delete_person(person)
  d.then((boolean)=>{
    if (boolean)
      res.sendStatus(200)
    else
      res.sendStatus(500)
  })
  d.catch(res.sendStatus(500));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
