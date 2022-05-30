const express = require("express");
const { refreshMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

const { login, refresh, signUp } = require("../controllers/authController");

router.post("/login", login);
router.post("/sign_up", signUp);
router.post("/refresh", refreshMiddleware, refresh);

module.exports = router;
