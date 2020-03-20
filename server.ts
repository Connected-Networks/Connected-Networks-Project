const express = require("express");
const path = require("path");
const session = require("express-session");
// const passport = require("./config/passport");
const models = require("./sequelizeDatabase/modelSetup");
const SessionStore = require("express-session-sequelize")(session.Store);
import { app, Passport } from "./app";

const port = process.env.PORT || 5000;

models.sequelize.connect();
app.use(
  session({
    secret: "http://bitly.com/98K8eH",
    store: new SessionStore({ db: models.sequelize }),
    resave: false,
    saveUninitialized: false
  })
);
app.use(Passport.initialize());
app.use(Passport.session());
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
