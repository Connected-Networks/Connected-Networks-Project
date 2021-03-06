import Passport from "./config/passport";
import AuthController from "./AuthController";
import PeopleController from "./PeopleController";
import CompaniesController from "./CompaniesController";
import FundsController from "./FundsController";
import HistoryController from "./HistoryController";
import ParsingController from "./ParsingController";
import UsersController from "./UsersController";
import UpdatesController from "./UpdatesController";
const express = require("express");
const router = express.Router();

router.post("/signup", AuthController.signup);

router.post("/login", Passport.authenticate("local"), AuthController.handleLoginSuccess);

router.get("/user", AuthController.getCurrentUser);

router.post("/logout", AuthController.logout);

router.get("/users", UsersController.getOtherUsers);

router.post("/csv", ParsingController.handleCsvRequest);

router.get("/people", PeopleController.getPeople);

router.get("/people/recent", PeopleController.getRecentlyChangedPeople);

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

router.get("/shareFund/:id", FundsController.getUsersSharedWith);

router.get("/history/:id", HistoryController.getHistory);

router.put("/history", HistoryController.updateHistory);

router.post("/history", HistoryController.addHistory);

router.delete("/history/:id", HistoryController.deleteHistory);

router.post("/updates", UpdatesController.receiveUpdates);

module.exports = router;
