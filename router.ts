import BackendProcessing from "./backend-processing";
import Passport from "./config/passport";
import AuthController from "./AuthController";
import PeopleController from "./PeopleController";
const express = require("express");
const router = express.Router();

// router.get("/users", (req, res) => {
//   const be = new BackendProcessing();
//   be.getAllUsers().then(users => {
//     res.json({ users });
//   });
// });

router.post("/signup", AuthController.signup);

router.post("/login", Passport.authenticate("local"), AuthController.handleLoginSuccess);

router.get("/user", AuthController.getCurrentUser);

router.post("/logout", AuthController.logout);

//Returns all users except the current user
router.get("/users", (req, res) => {
  let userID = req.user.UserID;
  let be = new BackendProcessing();
  be.getOtherUsers(userID)
    .then((users) => {
      res.json({ users });
    })
    .catch((error) => {
      console.error("An error occurred while retrieving users");
      console.error(error);
    });
});

router.post("/shareFund", (req, res) => {
  let fundID = res.body.fundId;
  let user = res.body.user;
  let be = new BackendProcessing();
  be.sharefund(fundID, user)
    .then((boolean) => {
      if (boolean) {
        console.log(`Shared ${req.user.username}'s fund with id: ${req.body.fundId} with User: ${req.body.user.username}`);
        res.sendStatus(200);
      } else res.sendStatus(500);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

router.post("/csv", (req, res) => {
  try {
    let data = req.body.data;
    let fileName = req.body.fileName;
    let userID = req.user.UserID;
    let be = new BackendProcessing();
    be.processRawCSV(data, fileName, userID).then((results) => {
      res.sendStatus(200);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/people", PeopleController.getPeople);

router.get("/people/:companyId", PeopleController.getPeopleByCompany);

router.get("/people/original/:companyId", PeopleController.getPeopleByOriginalCompany);

router.put("/people", PeopleController.updatePerson);

router.post("/people", PeopleController.addPerson);

router.delete("/people/:id", PeopleController.deletePerson);

router.get("/company", (req, res) => {
  try {
    let be = new BackendProcessing();
    let userID = req.user.UserID;
    let data = be.retrieveCompaniesFromDatabase(userID).then((results) => {
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

router.put("/company", (req, res) => {
  //update company
  let be = new BackendProcessing();
  let company = req.body;
  let userID = req.user.UserID;
  let fundID = company.FundID;
  PeopleController.userCanChangeFund(userID, fundID).then((authorized) => {
    if (!authorized) {
      console.error("user is not authorized to change companies in that fund");
      res.sendStatus(500);
      return;
    }
    let update = be.update_company(company);
    update.then((boolean) => {
      if (boolean) {
        console.log("company updated");
        res.sendStatus(200);
      } else res.sendStatus(500);
    });
    update.catch(() => {
      res.sendStatus(500);
    });
  });
});

router.post("/company", (req, res) => {
  //add company
  let be = new BackendProcessing();
  let company = req.body.newData;
  let userID = req.user.UserID;
  let fundID = company.FundID;
  PeopleController.userCanChangeFund(userID, fundID).then((authorized) => {
    if (!authorized) {
      console.error("user cannot add a company to that fund");
      res.sendStatus(500);
      return;
    }
    let i = be.insert_company(company);
    i.then((boolean) => {
      if (boolean) {
        console.log("person added");
        res.sendStatus(200);
      } else res.sendStatus(500);
    });
    i.catch(res.sendStatus(500));
  });
});

router.delete("/company/:id", (req, res) => {
  //delete company
  let be = new BackendProcessing();
  let company = req.params.id;
  let userID = req.user.UserID;
  let fundID = company.FundID;
  PeopleController.userCanChangeFund(userID, fundID).then((authorized) => {
    if (!authorized) {
      console.error("user cannot delete a company from that fund");
      res.sendStatus(500);
      return;
    }
    let d = be.delete_company(company);
    d.then((boolean) => {
      if (boolean) res.sendStatus(200);
      else res.sendStatus(500);
    });
    d.catch(res.sendStatus(500));
  });
});

router.get("/funds", (req, res) => {
  //return type should be an Array of SideMenuFund objects as defined in App.tsx.
  try {
    let be = new BackendProcessing();
    let userID = req.user.UserID;
    let results = be.retrieveFundsFromDatabase(userID);
    results.then((funds) => {
      res.json({ data: funds });
    });
    results.catch(() => {
      res.sendStatus(500);
    });
  } catch (error) {
    res.sendStatus(500);
  }
});
router.post("/funds", (req, res) => {
  let be = new BackendProcessing();
  console.log("Adding fund: " + req.body.newFundName + " to the database");
  let fund = req.body.newFundName;
  be.insert_fund(fund).then((result) => {
    if (result) res.sendStatus(200);
    else res.sendStatus(500);
  });
});

router.put("/funds", (req, res) => {
  //Todo for Aaron, implement this function so it updates an existing fund, the fund can be accessed by req.body.fund,
  //req.body.fund.name is probably gonna be the thing that always change
  //Temp until function is implemented
  let be = new BackendProcessing();
  let userID = req.user.UserID;
  PeopleController.userCanChangeFund(userID, req.body.fund.id).then((authorized) => {
    if (!authorized) {
      console.error("User cannot update the fund");
      res.sendStatus(500);
      return;
    }
    console.log("Updated fund with id: " + req.body.fund.id + " to be called: " + req.body.fund.name);
    let fund = req.body.fund;
    be.update_fund(fund).then((result) => {
      if (result) res.sendStatus(200);
      else res.sendStatus(500);
    });
  });
});

router.get("/funds/:id", (req, res) => {
  try {
    let be = new BackendProcessing();
    let userID = req.user.UserID;
    let fundID = req.params.id;
    be.userSeesFund(userID, fundID).then((authorized) => {
      if (!authorized) {
        console.error("User " + userID + " cannot see Fund " + fundID);
        res.sendStatus(500);
        return;
      }
      //console.log("params: " + JSON.stringify(req.params));
      //console.log("type: " + typeof fundID);
      //console.log("string: " + fundID);
      let data = be.retrieveCompaniesFromFund(fundID).then((results) => {
        if (results != null) {
          res.json({ data: results });
        } else res.sendStatus(500);
      });
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get("/history/:id", (req, res) => {
  let be = new BackendProcessing();
  let individualID = req.params.id;
  let userID = req.user.UserID;
  be.userCanSeeIndividual(userID, individualID).then((authorized) => {
    if (!authorized) {
      console.error("User cannot see history of individual " + individualID);
      res.sendStatus(500);
      return;
    }
    let g = be.getHistoryOfIndividual(individualID);
    g.then((results) => {
      res.json({ data: results });
    });
    g.catch((error) => {
      res.sendStatus(500);
    });
  });
});

router.put("/history", (req, res) => {
  let be = new BackendProcessing();
  let history = req.body;
  let userID = req.user.UserID;
  let individual = req.employee;
  be.userCanChangeIndividual(userID, individual.individualID).then((authorized) => {
    if (!authorized) {
      console.error("User cannot add history to individual " + individual.IndividualID);
      res.sendStatus(500);
      return;
    }
    let ins = be.insertHistory(history, individual, userID);
    ins.then((result) => {
      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });
    ins.catch((error) => {
      res.sendStatus(500);
    });
  });
});

router.post("/history/:id", (req, res) => {
  let be = new BackendProcessing();
  let history = req.body;
  let individual = req.employee;
  let userID = req.user.UserID;
  be.userCanChangeIndividual(userID, individual.individualID).then((authorized) => {
    if (!authorized) {
      console.error("User cannot edit history of individual " + individual.IndividualID);
      res.sendStatus(500);
      return;
    }
    let upd = be.updateHistory(history, individual, userID);
    upd.then((result) => {
      if (result) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });
    upd.catch((error) => {
      res.sendStatus(500);
    });
  });
});

module.exports = router;
