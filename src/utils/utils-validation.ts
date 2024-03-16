import { ZodError } from "zod";
import { RequestValidationError } from "../errors/err-validation";

import { Request } from "express";
import { User } from "../entities/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserUnauthorizedError } from "../errors/err-user";
import z from "zod";
import { Iat } from "../entities/other";

export const zodParse = <T extends z.ZodTypeAny>(schema: T, data: unknown, errMessage: string | undefined = undefined): z.infer<T> => {
    try {
        return schema.parse(data);
    } catch (err) {
        // handle error
        console.log(err);

        if (err instanceof ZodError) {
            const e = err.errors[0];

            throw new RequestValidationError(errMessage + ` (${e.code}: ${e.path[0]}).`);
        }

        throw new RequestValidationError();
    }
}

export function decode(token: string): string | JwtPayload {
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET as string);
        //console.log(decoded);

        return decoded;
    }
    catch (err) {
        throw new UserUnauthorizedError("Invalid token.");
    }
}
