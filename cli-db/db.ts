import { User } from "./User.js";
import { appendFile } from "fs/promises";
import { createReadStream } from "fs";

import * as readline from "node:readline";

const dbPath = "db.txt";

const storeUsers = (users: User[]): Promise<void> => {
  if (users.length === 0) return Promise.resolve();
  const repr: string =
    users.map((user) => JSON.stringify(user)).join("\n") + "\n";
  return appendFile(dbPath, repr);
};

const findUser = async ({ name }: { name: string }): Promise<User | null> => {
  const readstream = createReadStream(dbPath);
  try {
    const rl = readline.createInterface({ input: readstream });
    for await (const line of rl) {
      if (!line) continue;
      const userJson = JSON.parse(line);
      const user = new User(userJson.name, userJson.age, userJson.gender);
      if (user.name === name) {
        return user;
      }
    }
  } finally {
    readstream.close();
  }
  return null;
};

export { storeUsers, findUser };
