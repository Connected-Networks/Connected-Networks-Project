import BackendProcessing from "./backend-processing";

export default class AuthController {
  static async signup(req, res) {
    const be = new BackendProcessing();
    const { email, username, password } = req.body;

    if (!be.emailIsValid(email) || !be.passwordIsValid(password)) {
      res.sendStatus(406);
      return;
    }

    if (await be.emailIsTaken(email)) {
      res.sendStatus(409);
      return;
    }

    if (await be.usernameIsTaken(username)) {
      res.sendStatus(409); //TODO: Add a different error message
      return;
    }

    try {
      await be.insertUser(email, username, password);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  static handleLoginSuccess(req, res) {
    res.json({ username: req.user.Username });
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
}
