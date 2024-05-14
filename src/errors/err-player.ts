import { RestError } from "./err-rest";

export class PlayerAlreadyExistsError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 409,
        public name = "PlayerAlreadyExistsError"
    ) {
        super(message);
    }
}

export class PlayerNotFoundError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 404,
        public name = "PlayerNotFoundError"
    ) {
        super(message);
    }
}

export class PlayerAlreadyInQueueError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 409,
        public name = "PlayerAlreadyInQueueError"
    ) {
        super(message);
    }
}

export class PlayerNotInQueueError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 404,
        public name = "PlayerNotInQueueError"
    ) {
        super(message);
    }
}

export class QueueClosedError extends RestError {
    constructor(
        message: string | undefined = undefined,
        public statusCode: number = 400,
        public name = "QueueClosedError"
    ) {
        super(message);
    }
}
