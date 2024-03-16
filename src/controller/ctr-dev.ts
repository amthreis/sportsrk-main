import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../entities/user";
import { FootballRepo } from "../repos/repo-football";
import { UserRepo } from "../repos/repo-user";

export async function getAllPlayers(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const plys = await FootballRepo.getAllPlayers();

    res.status(200).json(plys);
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);
    const plys = await UserRepo.getAll();

    res.status(200).json(plys);
}