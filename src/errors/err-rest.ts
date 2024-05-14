export class RestError extends Error {
    constructor(
            message: string | undefined = undefined,
            public statusCode: number = 400,
            public name = "RestError"
        ) {
        super(message);
    }
}