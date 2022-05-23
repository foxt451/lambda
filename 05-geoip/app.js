import express from "express";
const app = express();

import ipRoute from "./routes/ip.js";

app.set("trust proxy", "loopback")
app.use("/ip", ipRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
