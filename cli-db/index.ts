import { queryUser, askToFind } from "./console.js";
import { User } from "./User.js";
import { storeUsers, findUser } from "./db.js";

const users: User[] = [];

while (true) {
  const user = await queryUser();
  if (user === null) {
    break;
  } else {
    users.push(user);
  }
}

await storeUsers(users);

const nameToFind: string | null = await askToFind();
if (nameToFind !== null) {
  const user = await findUser({ name: nameToFind });
  console.log(user ?? "Not found");
}
