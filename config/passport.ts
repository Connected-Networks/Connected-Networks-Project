const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const database = require("../sequelizeDatabase/sequelFunctions");

const strategy = new LocalStrategy((username, password, done) => {
  //Temp until we integrate with the database
  //Todo for Aaron: Authenticate user here. Should check if username and passwords are matching with the ones in the database.
  database
    .getUserByUsername(username)
    .then(user => {
      if (user.Password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    })
    .catch(err => {
      return done(err);
    });
});

passport.serializeUser((user, done) => {
  done(null, { _id: user._id });
});

passport.deserializeUser((user, done) => {
  //Todo for Aaron: Simply get the user with the matching id from the database and return it with done(null, user);
  //It is safe to assume that the user exists because the check process will be always be called before calling this method.
  //However, I might be wrong.
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
