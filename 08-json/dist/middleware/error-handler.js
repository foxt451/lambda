import { StatusCodes } from "http-status-codes";
const errorHandler = (err, req, res, next) => {
    let statusCode;
    if ("statusCode" in err && typeof err.statusCode === "number") {
        statusCode = err.statusCode;
    }
    else if (err.name === "ValidationError") {
        statusCode = StatusCodes.BAD_REQUEST;
    }
    else {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return res
        .status(statusCode)
        .json({ msg: err.message ?? "Oops... an error ocurred" });
};
export default errorHandler;
