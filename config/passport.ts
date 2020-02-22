const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const strategy = new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
  //Temp until we integrate with the database
  if (username === "user1" && password === "123") {
    const user = {
      _id: 0,
      username: "user1",
      email: "never@gonna.com"
    };
    return done(null, user);
  }
  if (username === "user2" && password === "123") {
    const user = {
      _id: 1,
      username: "user2",
      email: "give@you.up"
    };
    return done(null, user);
  }
  return done(null, false, { message: "Incorrect username" });
});

passport.serializeUser((user, done) => {
  done(null, { _id: user._id });
});

passport.deserializeUser((user, done) => {
  if (user._id === 0) {
    const user1 = {
      _id: 0,
      username: "user1",
      email: "never@gonna.com"
    };
    return done(null, user1);
  }
  const user2 = {
    _id: 1,
    username: "user2",
    email: "give@you.up"
  };
  return done(null, user2);
});

passport.use(strategy);

module.exports = passport;
