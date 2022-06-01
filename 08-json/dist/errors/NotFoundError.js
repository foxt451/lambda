import CustomAPI_Error from "./CustomAPI_Error.js";
import { StatusCodes } from "http-status-codes";
export default class NotFoundError extends CustomAPI_Error {
    constructor(message) {
        super(message, StatusCodes.NOT_FOUND);
    }
}
;
