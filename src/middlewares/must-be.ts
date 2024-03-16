import { NextFunction, Request, Response } from "express";
import { UserRequest, UserRole, getUserRolePriority, zUser } from "../entities/user";
import { UserUnauthorizedError } from "../errors/err-user";
import { decode as decodeToken, zodParse } from "../utils/utils-validation";
import { zIat } from "../entities/other";

export const mustBe = (role: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization'];

        //console.log("token", token);

        if (!token)
            throw new UserUnauthorizedError("Invalid token.");

        const decoded = decodeToken(token);

        const user = zodParse(zUser.and(zIat), decoded, "Malformed token.");

        const myRP = getUserRolePriority(user.role);
        const rp = getUserRolePriority(role);

        if (myRP < rp) {
            console.log(`noAuth: expected ${role}, ${user.email} is ${user.role}.`);
            throw new UserUnauthorizedError("User doesn't have the necessary permission(s).");
        }

        const uReq = (req as unknown) as UserRequest;
        uReq.user = user;

        next();
    }
}