import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../entities/user";
import { FootballRepo } from "../repos/repo-football";
import { PlayerPos } from "../entities/player";
import * as redis from "../redis";
import { QueueClosedError } from "../errors/err-player";


export async function joinQueue(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const isQueueOpen = await redis.peek("football:queue:open");

    if (!isQueueOpen)
        throw new QueueClosedError();

    const ply = await FootballRepo.getPlayerByUserId(ureq.user.id);

    await FootballRepo.addToQueue(ply);

    res.status(200).json({
        message: `Player.User(${ply.user.email}) has been added to the Football Queue.`
    });
}

export async function leaveQueue(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const isQueueOpen = await redis.peek("football:queue:open");

    if (!isQueueOpen)
        throw new QueueClosedError();

    const ply = await FootballRepo.getPlayerByUserId(ureq.user.id);

    await FootballRepo.removeFromQueue(ply);

    res.status(200).json({
        message: `Player.User(${ply.user.email}) has been removed from the Football Queue.`
    });
}

export async function enrollToFootball(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const ply = await FootballRepo.createPlayer({
        user: ureq.user,
        pos: PlayerPos.AM
    });

    res.status(200).json({
        message: "Enrolled to football successfully.",
        player: ply
    });
}

