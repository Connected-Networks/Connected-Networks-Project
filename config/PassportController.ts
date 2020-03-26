const database = require("../sequelizeDatabase/sequelFunctions");
const bcrypt = require("bcryptjs");

export default class PassportController {
  static async localStrategy(username, password, done) {
    try {
      const user = await database.getUserByUsername(username);

      if (user === null) {
        return done(null, false, { message: "No user found" });
      }

      if (!(await bcrypt.compareSync(password, user.Password))) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }

  static serializeUser(user, done) {
    done(null, { id: user.UserID });
  }

  static async deserializeUser(user, done) {
    try {
      const foundUser = await database.getUserById(user.id);
      done(null, foundUser);
    } catch (err) {
      done(err);
    }
  }
}
