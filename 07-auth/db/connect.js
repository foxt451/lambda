const mongodb = require("mongodb");

const client = new mongodb.MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let conn;

const initDb = async () => {
  conn = await client.connect();
};

const getDb = (name) => {
  return conn.db(name);
};

module.exports = { initDb, getDb };
