import BackendProcessing from "./backend-processing";
import Passport from "./config/passport";
import AuthController from "./AuthController";
import PeopleController from "./PeopleController";
import CompaniesController from "./CompaniesController";
import FundsController from "./FundsController";
import HistoryController from "./HistoryController";
const express = require("express");
const router = express.Router();

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

router.get("/people/:companyID", PeopleController.getPeopleByCompany);

router.get("/people/original/:companyID", PeopleController.getPeopleByOriginalCompany);

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

router.delete("/funds/:id", FundsController.deleteFund);

router.post("/shareFund", FundsController.shareFund);

router.get("/history/:id", HistoryController.getHistory);

router.put("/history", HistoryController.updateHistory);

router.post("/history/:id", HistoryController.addHistory);

module.exports = router;
