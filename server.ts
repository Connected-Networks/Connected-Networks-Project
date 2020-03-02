const express = require("express");
const path = require("path");
const papa = require("papaparse");
const app = express();
import BackendProcessing from "./backend-processing";
import { rejects } from "assert";
import { type } from "os";
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/csv", (req, res) => {
  try {
    let data = req.body.data;
    let be = new BackendProcessing();
    be.processRawCSV(data).then(results => {
      res.sendStatus(200);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/people", (req, res) => {
  try {
    let be = new BackendProcessing();
    let data = be.retrievePeopleFromDatabase().then(results => {
      if (!results) {
        res.sendStatus(500);
      } else {
        res.json({ data: results });
      }
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

//retrieve all individuals whose most recent employment was in the specified company
app.get("/people/:companyId", (req, res) => {
  try {
    let be = new BackendProcessing();
    let data = be.retrievePeopleViaCompany(req.params.companyId).then(results => {
      if (!results) {
        res.sendStatus(500);
      } else {
        res.json({ data: results });
      }
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.put("/people", (req, res) => {
  //update person
  let be = new BackendProcessing();
  //console.log("body: "+JSON.stringify(req.body))
  let person = req.body;
  let update = be.update_person(person);
  update.then(boolean => {
    if (boolean) res.sendStatus(200);
    else res.sendStatus(500);
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
  i.then(boolean => {
    if (boolean) res.sendStatus(200);
    else res.sendStatus(500);
  });
  i.catch(res.sendStatus(500));
});

app.delete("/people/:id", (req, res) => {
  //delete person
  let be = new BackendProcessing();
  let person = req.params.id;
  let d = be.delete_person(person);
  d.then(boolean => {
    if (boolean) res.sendStatus(200);
    else res.sendStatus(500);
  });
  d.catch(res.sendStatus(500));
});

app.get("/company", (req, res) => {
  try {
    let be = new BackendProcessing();
    let data = be.retrieveCompaniesFromDatabase().then(results => {
      if (!results) {
        res.sendStatus(500);
      } else {
        res.json({ data: results });
      }
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.put("/company", (req, res) => {
  //update company
  let be = new BackendProcessing();
  //console.log("body: "+JSON.stringify(req.body))
  let company = req.body;
  let update = be.update_company(company);
  update.then(boolean => {
    if (boolean) {
      console.log("company updated");
      res.sendStatus(200);
    } else res.sendStatus(500);
  });
  update.catch(() => {
    res.sendStatus(500);
  });
});

app.post("/company", (req, res) => {
  //add company
  let be = new BackendProcessing();
  let company = req.body.newData;
  let i = be.insert_company(company);
  i.then(boolean => {
    if (boolean) {
      console.log("person added");
      res.sendStatus(200);
    } else res.sendStatus(500);
  });
  i.catch(res.sendStatus(500));
});

app.delete("/company/:id", (req, res) => {
  //delete company
  let be = new BackendProcessing();
  let company = req.params.id;
  let d = be.delete_company(company);
  d.then(boolean => {
    if (boolean) res.sendStatus(200);
    else res.sendStatus(500);
  });
  d.catch(res.sendStatus(500));
});

app.get("/funds", (req, res) => {
  //return type should be an Array of SideMenuFund objects as defined in App.tsx.
  try {
    let be = new BackendProcessing();
    let results = be.retrieveFundsFromDatabase();
    results.then((funds)=>{
      res.json({ data: funds});
    })
    results.catch(()=>{
      res.sendStatus(500)
    })
  } catch (error) {
    res.sendStatus(500);
  }
});
app.post("/funds",(req,res)=>{
  let be = new BackendProcessing();
  console.log("Adding fund: " + req.body.newFundName + " to the database");
  let fund = req.body.newFundName;
  be.insert_fund(fund).then((result)=>{
    if (result)
      res.sendStatus(200)
    else
      res.sendStatus(500)
  })
})


app.put("/funds", (req, res) => {
  //Todo for Aaron, implement this function so it updates an existing fund, the fund can be accessed by req.body.fund,
  //req.body.fund.name is probably gonna be the thing that always change
  //Temp until function is implemented
  let be = new BackendProcessing();
  console.log("Updated fund with id: " + req.body.fund.id + " to be called: " + req.body.fund.name);
  let fund = req.body.fund;
  be.update_fund(fund).then((result)=>{
    if (result)
      res.sendStatus(200)
    else
      res.sendStatus(500)
  })
});

app.get("/funds/:id", (req, res) => {
  try {
    let be = new BackendProcessing();
    let fundID = req.params.id;
    console.log("params: "+JSON.stringify(req.params))
    console.log("type: "+typeof(fundID))
    console.log("string: "+fundID)
    let data = be.retrieveCompaniesFromFund(fundID).then(results => {
        if (results!=null){
          res.json({data: results});
        }
        else
          res.sendStatus(500)
      })
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/people/original/:companyId",(req,res)=>{
  try {
    let be = new BackendProcessing();
    let companyID = req.params.id;
    let data = be.retrievePeopleFromOriginalCompany(companyID).then(results => {
      if (!results) {
        res.sendStatus(500);
      } else {
        res.json({ data: results });
      }
    });
  } catch (error) {
    res.sendStatus(500);
  }
})

app.get("/history/:id", (req, res) => {
    let be = new BackendProcessing()
    let individualID = req.params.id;
    let g = be.getHistoryOfIndividual(individualID)
    g.then((results)=>{
      res.json({data:results})
    })
    g.catch((error)=>{
      res.sendStatus(500)
    })
});

app.put("/history", (req, res) => {
  let be = new BackendProcessing()
  let history = req.body;
  let ins = be.insertHistory(history)
  ins.then((result)=>{
    if (result){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  })
  ins.catch((error)=>{
    res.sendStatus(500)
  })
});

app.post("/history/:id", (req, res) => {
  let be = new BackendProcessing()
  let history = req.body;
  let upd = be.updateHistory(history)
  upd.then((result)=>{
    if (result){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  })
  upd.catch((error)=>{
    res.sendStatus(500)
  })
});

app.delete("/history", (req, res) => {
  //delete History
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
