import CustomAPI_Error from "./CustomAPI_Error.js";
import { StatusCodes } from "http-status-codes";
export default class ForbiddenError extends CustomAPI_Error {
    constructor(message) {
        super(message, StatusCodes.FORBIDDEN);
    }
}
;
