import { NextFunction, Request, Response } from "express";
import { UserRepo } from "../repos/repo-user";
import { UserRole, zUserLogin, zUserSignup } from "../entities/user";

import { zodParse } from "../utils/utils-validation";

import jwt from "jsonwebtoken";

export async function signup(req: Request, res: Response, next: NextFunction) {
    const body = zodParse(zUserSignup, req.body, "Server couldn't validate the request's body");

    const user = await UserRepo.create(body.email, UserRole.USER);

    res.json({
        message: `Signed up successfully!`,
        user
    });
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const body = zodParse(zUserLogin, req.body, "Server couldn't validate the request's body");
    const user = await UserRepo.getByEmail(body.email);

    const token = jwt.sign(user, process.env.JWT_SECRET as string);

    res.status(200).json({
        message: `Logged in as ${user.email}.`,
        token
    });
}