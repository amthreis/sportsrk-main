import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { RestError } from "../errors/err-rest";


export const errorHandler: ErrorRequestHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof RestError) {
        res.status(error.statusCode).json({
            error: {
                name: error.name,
                message: error.message,
                status: error.statusCode
            }
        });
    } else if (error instanceof Error) {
        res.status(400).json({
            error
        });
    }
}