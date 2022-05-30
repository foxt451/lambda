require("dotenv").config();
const express = require("express");
const { initDb } = require("./db/connect");
require("express-async-errors");
const app = express();

app.use(express.json());

const apiRouter = require("./routes/apiRoutes");
app.use("/api/v1", apiRouter);

const errorHandler = require("./middleware/error-handler");
app.use(errorHandler);

const port = process.env.PORT || 3000;
const start = async () => {
  await initDb();
  console.log("Connected to db");
  app.listen(port, () => {
    console.log("Server listening...");
  });
};

start();
