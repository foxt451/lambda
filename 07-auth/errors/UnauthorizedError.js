const CustomAPI_Error = require("./CustomAPI_Error");
const { StatusCodes } = require("http-status-codes");

module.exports = class UnauthorizedError extends CustomAPI_Error {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
};
