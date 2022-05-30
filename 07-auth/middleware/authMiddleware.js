const { JsonWebTokenError } = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../errors");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  processToken(req, process.env.JWT_SECRET, (user) => {
    req.user = user;
    next();
  });
};

// validates refresh token for correctness and presence, not for existence in db
const refreshMiddleware = async (req, res, next) => {
  processToken(req, process.env.REFRESH_SECRET, (refresh) => {
    req.refresh = refresh;
    next();
  });
};

const processToken = (req, secret, cb) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Please provide a valid Authoriation header");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, secret, (err, value) => {
    if (err) {
      throw new ForbiddenError("Invalid or expired token");
    }
    cb(value);
  });
};

module.exports = { authMiddleware, refreshMiddleware };
