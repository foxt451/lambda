import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "express-async-errors";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import jsonRouter from "./routes/jsonRoutes.js";
import connectDb from "./db/connect.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", jsonRouter);

app.use(errorHandlerMiddleware);

if (process.env.MONGO_URI) {
  await connectDb(process.env.MONGO_URI);
  console.log("Connected to db");
} else {
  throw new Error("Absent connection string in config");
}

app.listen(port, () => {
  console.log(`Server listening (http://localhost:${port})`);
});
