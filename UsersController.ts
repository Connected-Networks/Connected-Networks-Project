const database = require("./sequelizeDatabase/sequelFunctions");

export default class UsersController {
  static async getOtherUsers(req, res) {
    try {
      let userID = req.user.UserID;
      const users = await UsersController.getOtherUsersFromDatabase(userID);

      console.log(users);

      res.send({ users });
    } catch (error) {
      console.error("An error occurred while retrieving users");
      console.error(error);
      res.sendStatus(500);
    }
  }

  static async getOtherUsersFromDatabase(currentUserID) {
    const users = await database.getAllUsers();
    let filteredList = users.filter((user) => {
      return user.UserID !== currentUserID;
    });

    const mappedUsers = filteredList.map((user) => {
      return { id: user.UserID, name: user.Username };
    });

    return mappedUsers;
  }
}
