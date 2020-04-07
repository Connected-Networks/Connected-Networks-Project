import BackendProcessing from "./backend-processing";
import Passport from "./config/passport";
import AuthController from "./AuthController";
import PeopleController from "./PeopleController";
import CompaniesController from "./CompaniesController";
import FundsController from "./FundsController";
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

router.get("/company", CompaniesController.getCompanies);

router.put("/company", CompaniesController.updateCompany);

router.post("/company", CompaniesController.addCompany);

router.delete("/company/:id", CompaniesController.deleteCompany);

router.get("/funds", FundsController.getFunds);

router.post("/funds", FundsController.addFund);

router.put("/funds", FundsController.updateFund);

router.get("/funds/:id", FundsController.getCompaniesOfFund);

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
