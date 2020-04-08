interface SimpleUser {
  id: number;
  username: string;
}

export default class BackendProcessing {
  // //returns undefined if fundID is not found
  // retrieveFundName(fundID): Promise<String> {
  //   return new Promise<String>((resolve, reject) => {
  //     database.retrieveFundName(fundID).then((result) => {
  //       resolve(result);
  //     });
  //   });
  // }

  getOtherUsers(currentUserID) {
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
