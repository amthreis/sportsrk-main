import { RestError } from "./err-rest";

export class UserNotFoundError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 404,
        public name = "UserNotFoundError"
    ) {
        super(message);
    }
}

export class UserAlreadyExistsError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 404,
        public name = "UserAlreadyExistsError"
    ) {
        super(message);
    }
}

export class UserUnauthorizedError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 401,
        public name = "UserUnauthorizedError"
    ) {
        super(message);
    }
}