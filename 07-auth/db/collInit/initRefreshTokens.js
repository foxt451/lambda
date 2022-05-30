require("dotenv").config();
const mongodb = require("mongodb");
const { initDb, getDb } = require("../connect");

const run = async () => {
  await initDb();

  await getDb("users").createCollection("refreshTokens", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email"],
        properties: {
          email: {
            bsonType: "string",
          },
        },
      },
    },
  });

  console.log("Successfully created the collection");
  process.exit();
};

run();
