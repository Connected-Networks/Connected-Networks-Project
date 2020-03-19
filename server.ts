const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport");
const app = express();
const models = require("./sequelizeDatabase/modelSetup");
const SessionStore = require("express-session-sequelize")(session.Store);
const router = require("./routes");

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

app.use("/", router);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export default app;
