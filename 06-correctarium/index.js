import express from "express";
import "express-async-errors";
const app = express();

app.use(express.json());

import evaluationRouter from "./routes/evaluationRoutes.js";
app.use("/api/v1/evaluation", evaluationRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listetning on port ${port}...`);
});
