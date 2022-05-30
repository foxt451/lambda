const CustomAPI_Error = require("./CustomAPI_Error");
const { StatusCodes } = require("http-status-codes");

module.exports = class NotFoundError extends CustomAPI_Error {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
};
