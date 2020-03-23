const express = require("express");
const path = require("path");
const papa = require("papaparse");
const session = require("express-session");
const passport = require("./config/passport");
const app = express();
const models = require("./sequelizeDatabase/modelSetup");
const SessionStore = require("express-session-sequelize")(session.Store);
import BackendProcessing from "./backend-processing";

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  session({
    secret: "http://bitly.com/98K8eH",
    store: new SessionStore({ db: models.sequelize }),
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/signup", async (req, res) => {
  const be = new BackendProcessing();
  const { email, username, password } = req.body;

  if (await be.emailIsTaken(email)) {
    res.sendStatus(409); //TODO: Add error message
  }

  if (await be.usernameIsTaken(email)) {
    res.sendStatus(409); //TODO: Add a different error message
  }

  if (!be.emailIsValid(email) || !be.passwordIsValid(password)) {
    res.sendStatus(406);
  }

  be.insertUser(email, username, password)
    .then(() => res.sendStatus(200))
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
});

app.get("/users", (req, res) => {
  const be = new BackendProcessing();
  be.getAllUsers().then(users => {
    res.json({ users });
  });
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ username: req.user.Username });
});

app.get("/user", (req, res) => {
  if (req.user) {
    res.json({ username: req.user.Username });
  } else {
    res.sendStatus(401);
  }
});

app.post("/logout", (req, res) => {
  if (req.user) {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(500);
  }
});

//Returns all users except the current user
app.get("/users", (req, res) => {
  let userID = req.user.UserID;
  let be = new BackendProcessing();
  be.getOtherUsers(userID)
    .then(users => {
      res.json({ users });
    })
    .catch(error => {
      console.error("An error occurred while retrieving users");
      console.error(error);
    });
});

app.post("/shareFund", (req, res) => {
  let fundID = res.body.fundId;
  let user = res.body.user;
  let be = new BackendProcessing();
  be.sharefund(fundID, user)
    .then(boolean => {
      if (boolean) {
        console.log(`Shared ${req.user.username}'s fund with id: ${req.body.fundId} with User: ${req.body.user.username}`);
        res.sendStatus(200);
      } else res.sendStatus(500);
    })
    .catch(error => {
      res.sendStatus(500);
    });
});

app.post("/csv", (req, res) => {
  try {
    let data = req.body.data;
    let fileName = req.body.fileName;
    let userID = req.user.UserID;
    let be = new BackendProcessing();
    be.processRawCSV(data, fileName, userID).then(results => {
      res.sendStatus(200);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/people", (req, res) => {
  try {
    let userID = req.user.UserID;
    let be = new BackendProcessing();
    let data = be.retrievePeopleFromDatabase(userID).then(results => {
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
    results.then(funds => {
      res.json({ data: funds });
    });
    results.catch(() => {
      res.sendStatus(500);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});
app.post("/funds", (req, res) => {
  let be = new BackendProcessing();
  console.log("Adding fund: " + req.body.newFundName + " to the database");
  let fund = req.body.newFundName;
  be.insert_fund(fund).then(result => {
    if (result) res.sendStatus(200);
    else res.sendStatus(500);
  });
});

app.put("/funds", (req, res) => {
  //Todo for Aaron, implement this function so it updates an existing fund, the fund can be accessed by req.body.fund,
  //req.body.fund.name is probably gonna be the thing that always change
  //Temp until function is implemented
  let be = new BackendProcessing();
  console.log("Updated fund with id: " + req.body.fund.id + " to be called: " + req.body.fund.name);
  let fund = req.body.fund;
  be.update_fund(fund).then(result => {
    if (result) res.sendStatus(200);
    else res.sendStatus(500);
  });
});

app.get("/funds/:id", (req, res) => {
  try {
    let be = new BackendProcessing();
    let fundID = req.params.id;
    console.log("params: " + JSON.stringify(req.params));
    console.log("type: " + typeof fundID);
    console.log("string: " + fundID);
    let data = be.retrieveCompaniesFromFund(fundID).then(results => {
      if (results != null) {
        res.json({ data: results });
      } else res.sendStatus(500);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/people/original/:companyId", (req, res) => {
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
});

app.get("/history/:id", (req, res) => {
  let be = new BackendProcessing();
  let individualID = req.params.id;
  let g = be.getHistoryOfIndividual(individualID);
  g.then(results => {
    res.json({ data: results });
  });
  g.catch(error => {
    res.sendStatus(500);
  });
});

app.put("/history", (req, res) => {
  let be = new BackendProcessing();
  let history = req.body;
  let userID = req.user.UserID;
  let individual = req.employee;
  let ins = be.insertHistory(history, individual, userID);
  ins.then(result => {
    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
  ins.catch(error => {
    res.sendStatus(500);
  });
});

app.post("/history/:id", (req, res) => {
  let be = new BackendProcessing();
  let history = req.body;
  let individual = req.employee;
  let userID = req.user.UserID;
  let upd = be.updateHistory(history, individual, userID);
  upd.then(result => {
    if (result) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
  upd.catch(error => {
    res.sendStatus(500);
  });
});

app.delete("/history", (req, res) => {
  //delete History
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
