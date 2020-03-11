const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const database = require("../sequelizeDatabase/sequelFunctions");
const bcrypt = require("bcryptjs");

const strategy = new LocalStrategy((username, password, done) => {
  database
    .getUserByUsername(username)
    .then(user => {
      if (bcrypt.compareSync(user.Password, password)) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    })
    .catch(err => {
      return done(err);
    });
});

passport.serializeUser((user, done) => {
  done(null, { id: user.UserID });
});

passport.deserializeUser((user, done) => {
  database
    .getUserById(user.id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(strategy);

module.exports = passport;
