import BackendProcessing from "./backend-processing";

export default class AuthController {
  static signup = async (req, res) => {
    const be = new BackendProcessing();
    const { email, username, password } = req.body;

    if (!be.emailIsValid(email) || !be.passwordIsValid(password)) {
      res.sendStatus(406);
      return;
    }

    if (await be.emailIsTaken(email)) {
      res.sendStatus(409); //TODO: Add error message
      return;
    }

    if (await be.usernameIsTaken(username)) {
      res.sendStatus(409); //TODO: Add a different error message
      return;
    }

    be.insertUser(email, username, password)
      .then(() => res.sendStatus(200))
      .catch(error => {
        console.log(error);
        res.sendStatus(500);
      });
  };

  static handleLoginSuccess = (req, res) => {
    res.json({ username: req.user.Username });
  };
}
