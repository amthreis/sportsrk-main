import { RestError } from "./err-rest";

export class UserValidationError extends RestError {
    constructor(
            message: string | undefined = undefined,
            public statusCode: number = 403,
            public name = "UserValidationError"
        ) {
        super(message);
    }
}

export class RequestValidationError extends RestError {
    constructor(
            message: string | undefined = undefined,
            public statusCode: number = 403,
            public name = "RequestValidationError"
        ) {
        super(message);
    }
}