require("dotenv").config();
const mongodb = require("mongodb");
const { initDb, getDb } = require("../connect");

const run = async () => {
  await initDb();

  await getDb("users").createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "password"],
        properties: {
          email: {
            bsonType: "string",
          },
          password: {
            bsonType: "string",
          },
        },
      },
    },
  });

  await getDb("users")
    .collection("users")
    .createIndex({ email: 1 }, { unique: true });

  console.log("Successfully created the collection");
  process.exit();
};

run();
