const database = require("../sequelizeDatabase/sequelFunctions");
const bcrypt = require("bcryptjs");

export default class PassportController {
  static localStrategy(username, password, done) {
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
  }

  static serializeUser(user, done) {
    done(null, { id: user.UserID });
  }

  static deserializeUser(user, done) {
    database
      .getUserById(user.id)
      .then(user => done(null, user))
      .catch(err => done(err));
  }
}
