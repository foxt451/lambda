const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    err.statusCode = StatusCodes.BAD_REQUEST;
    const pair = Object.entries(err.keyValue)[0];
    err.message = `${pair[0]} with value ${pair[1]} already exists`;
  }
  return res
    .status(err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: err.message });
};

module.exports = errorHandler;
