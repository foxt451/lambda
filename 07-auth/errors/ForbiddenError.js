const CustomAPI_Error = require("./CustomAPI_Error");
const { StatusCodes } = require("http-status-codes");

module.exports = class ForbiddenError extends CustomAPI_Error {
  constructor(message) {
    super(message, StatusCodes.FORBIDDEN);
  }
};
