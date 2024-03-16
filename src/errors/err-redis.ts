import { RestError } from "./err-rest";

export class RedisError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 400,
        public name = "RedisError"
    ) {
        super(message);
    }
}