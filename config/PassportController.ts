const database = require("../sequelizeDatabase/sequelFunctions");
const bcrypt = require("bcryptjs");

export default class PassportController {
  static async localStrategy(username, password, done) {
    try {
      const user = await database.getUserByUsername(username);

      if (user === null) {
        return done(null, false, { message: "User not found" });
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
      if (foundUser === null) {
        //deserializeUser is always called after inserting user,
        //so this case should never happen unless something went wrong in the database like a wipe out
        throw new Error("User not found");
      }
      done(null, foundUser);
    } catch (err) {
      done(err);
    }
  }
}
