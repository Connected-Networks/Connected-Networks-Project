//this is not verification code,
//this is for code meant to be executed to test the functionality of code being developed
//Only temporary and will removed later

import UpdatesController, { Change } from "./UpdatesController";
import NotificationController from "./NotificationController";

const main = async () => {
  const mapUsersToChanges: Map<string, number> = new Map<string, number>([
    ["hi", 1],
    ["heelo", 5],
  ]);

  for (const user of Array.from(mapUsersToChanges.keys())) {
    console.log(user);
  }
};

main();
