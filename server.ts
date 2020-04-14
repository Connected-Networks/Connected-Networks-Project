require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const models = require("./sequelizeDatabase/modelSetup");
const session = require("express-session");
const SessionStore = require("express-session-sequelize")(session.Store);
import Passport from "./config/passport";
const router = require("./router");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

models.sequelize.connect();
app.use(
  session({
    secret: "http://bitly.com/98K8eH",
    store: new SessionStore({ db: models.sequelize }),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(Passport.initialize());
app.use(Passport.session());

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/", router);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
