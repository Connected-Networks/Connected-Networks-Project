const database = require("./sequelizeDatabase/sequelFunctions");
const bcrypt = require("bcryptjs");

export default class AuthController {
  static async signup(req, res) {
    const { email, username, password } = req.body;

    if (!AuthController.emailIsValid(email) || !AuthController.passwordIsValid(password)) {
      res.sendStatus(406);
      return;
    }

    if (await AuthController.emailIsTaken(email)) {
      res.sendStatus(409);
      return;
    }

    if (await AuthController.usernameIsTaken(username)) {
      res.sendStatus(409); //TODO: Add a different error message
      return;
    }

    try {
      await AuthController.insertUser(email, username, password);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  static emailIsValid(email: string): boolean {
    const emailRegex = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    return emailRegex.test(String(email).toLowerCase());
  }

  static passwordIsValid(password: string): boolean {
    return password !== undefined && password.length >= 6;
  }

  static async usernameIsTaken(username: string) {
    const user = await database.getUserByUsername(username);
    return user !== null;
  }

  static async emailIsTaken(email: string) {
    const user = await database.getUserByEmail(email);
    return user !== null;
  }

  static async insertUser(email: string, username: string, password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await database.insertUser(username, hashedPassword, email);
  }

  static handleLoginSuccess(req, res) {
    res.send({ username: req.user.Username });
  }

  static logout(req, res) {
    if (req.user) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(500);
    }
  }

  static getCurrentUser(req, res) {
    if (req.user) {
      res.send({ username: req.user.Username });
    } else {
      res.sendStatus(401);
    }
  }
}
