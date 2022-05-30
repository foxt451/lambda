const {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { getDb } = require("../db/connect");
const mongodb = require("mongodb");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const bcrypt = require("bcrypt");
const saltRounds = 12;

const userColName = "users";
const signUp = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide an email and a password");
  }
  if (!validator.isEmail(email)) {
    throw new BadRequestError("Please provide a valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new BadRequestError(
      "Please provide a strong password (at least 8 letters, 1 uppercase, 1 lowercase, 1 number, 1 symbol)"
    );
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await getDb("users")
    .collection(userColName)
    .insertOne({ email, password: hashedPassword });
  res.sendStatus(StatusCodes.CREATED);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide an email and a password");
  }
  const user = await getDb("users").collection(userColName).findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Incorrect email or password");
  }
  const { accessToken, refreshToken } = await generateToken({ email });
  res.status(StatusCodes.OK).json({ accessToken, refreshToken });
};

const refreshTokenColName = "refreshTokens";
const generateToken = async (jwtBody) => {
  const ttl = Math.random() * 30 + 30;
  console.log(ttl);
  const accessToken = jwt.sign(jwtBody, process.env.JWT_SECRET, {
    expiresIn: `${ttl}s`,
  });
  const result = await getDb("users")
    .collection(refreshTokenColName)
    .insertOne(jwtBody);
  const refreshToken = jwt.sign(
    { _id: result.insertedId, ...jwtBody },
    process.env.REFRESH_SECRET
  );
  return { accessToken, refreshToken };
};

const refresh = async (req, res) => {
  const refresh = req.refresh;
  const deleted = await getDb("users")
    .collection(refreshTokenColName)
    .deleteOne({ _id: new mongodb.ObjectId(refresh._id) });
  if (deleted.deletedCount < 1) {
    throw new ForbiddenError("Token has been revoked");
  }
  const { accessToken, refreshToken } = await generateToken({
    email: refresh.email,
  });
  res.status(StatusCodes.OK).json({ accessToken, refreshToken });
};

module.exports = { login, refresh, signUp };
