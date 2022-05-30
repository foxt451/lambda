const express = require("express");
const router = express.Router();

const authRouter = require("./authRoutes");

router.use("/auth", authRouter);

const posts = [
  {
    email: "sviat@fd.cf",
    title: "Post 1",
  },
  {
    email: "svpetrenko123@gmail.com",
    title: "Post 2",
  },
];

const { authMiddleware } = require("../middleware/authMiddleware");
router.get("/me:num([0-9])", authMiddleware, (req, res) => {
  res.json({ num: req.params.num, data: { email: req.user.email } });
});

module.exports = router;
