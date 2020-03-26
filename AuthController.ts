const database = require("./sequelizeDatabase/sequelFunctions");
const bcrypt = require("bcryptjs");
import BackendProcessing from "./backend-processing";

export default class AuthController {
  static async signup(req, res) {
    const be = new BackendProcessing();
    const { email, username, password } = req.body;

    if (!this.emailIsValid(email) || !this.passwordIsValid(password)) {
      res.sendStatus(406);
      return;
    }

    if (await this.emailIsTaken(email)) {
      res.sendStatus(409);
      return;
    }

    if (await this.usernameIsTaken(username)) {
      res.sendStatus(409); //TODO: Add a different error message
      return;
    }

    try {
      await this.insertUser(email, username, password);
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
    return password.length >= 6;
  }

  static usernameIsTaken(username: string) {
    return new Promise<boolean>(resolve => {
      database
        .getUserByUsername(username)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  static emailIsTaken(email: string) {
    return new Promise<boolean>(resolve => {
      database
        .getUserByEmail(email)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  }

  static insertUser(email: string, username: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(password, 10);
      database
        .insertUser(username, hashedPassword, email)
        .then(() => resolve())
        .catch(() => reject());
    });
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
