const database = require("./sequelizeDatabase/sequelFunctions");

interface SimpleUser {
  id: number;
  username: string;
}

export default class UsersController {
  static async getOtherUsers(req, res) {
    let userID = req.user.UserID;
    this.getOtherUsersFromDatabase(userID)
      .then((users) => {
        res.json({ users });
      })
      .catch((error) => {
        console.error("An error occurred while retrieving users");
        console.error(error);
      });
  }

  static async getOtherUsersFromDatabase(currentUserID) {
    return new Promise<SimpleUser[]>((resolve, reject) => {
      database
        .getAllUsers()
        .then((users) => {
          let filteredList = users.filter((user) => {
            return user.UserID == currentUserID;
          });
          resolve(filteredList);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
