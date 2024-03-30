import { NextFunction, Request, Response } from "express";
import { UserRequest, UserRole, zSetSchJobs, zUserSignup } from "../entities/user";
import { FootballRepo } from "../repos/repo-football";
import { UserRepo } from "../repos/repo-user";
import { zodParse } from "../utils/utils-validation";
import { zAdminDeleteUserData, zAdminSetQueueState } from "../entities/admin";
import * as redis from "../redis";
import { RedisError } from "../errors/err-redis";

import z from "zod";
import { RestError } from "../errors/err-rest";

export async function addDev(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const body = zodParse(zUserSignup, req.body);

    const newDev = await UserRepo.create(body.email, UserRole.DEV);

    res.status(200).json({
        message: "New dev account added!",
        user: newDev
    });
}

export async function setSchJobs(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const body = zodParse(zSetSchJobs, req.body);

    try {
        await redis.lpush("main:sch-jobs", body.enable);
    }
    catch (err) {
        console.log(err);
        throw new RedisError();
    }

    res.status(200).json({
        message: `SchJobs set to ${body.enable}`
    });
}


export async function setFootballQueueState(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const sqs = zodParse(zAdminSetQueueState, req.body);

    try {
        await redis.lpush("football:queue:open", sqs.open);
    }
    catch (err) {
        console.log(err);
        throw new RedisError();
    }

    res.status(200).json({
        message: "<football> Queue state updated."
    });
}

export async function getFootballQueueState(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    try {
        const value = await redis.peek("football:queue:open");

        res.status(200).json({
            open: value || false
        });
    }
    catch (err) {
        console.log(err);
        throw new RedisError();
    }

}

export async function sendTBPGamesToSim(req: Request, res: Response, next: NextFunction) {
    const matchesTBP = await FootballRepo.getMatchesToBeSimmed();

    await redis.clear("football:matches:tbp");

    for (let m of matchesTBP) {
        await redis.lpush("football:matches:tbp", m);
    }

    await tellPlayerQueueIsReady();

    res.status(200).json({
        message: `OK. ${matchesTBP.length} matches were sent to be simulated.`
    });
}

export async function sendxToQueue(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    const rb = zodParse(z.object({ count: z.number() }), req.body);

    console.log("zz");
    const players = await FootballRepo.getAllPlayers(rb.count);

    console.log("aa");
    const response = await fetch("http://localhost:8586/", {
        body: JSON.stringify(players),
        method: "POST"
    });
    console.log("bb");

    //console.log(response);
    const result = await response.json();
    console.log(result);

    res.status(200).json(result);
}


export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const body = zodParse(zAdminDeleteUserData, req.body);

    if (body.email) {
        await UserRepo.deleteByEmail(body.email);

        res.status(200).json({
            message: `User(${body.email}) deleted permanently!`
        });
    } else if (body.id) {
        await UserRepo.deleteById(body.id);

        res.status(200).json({
            message: `User(${body.id}) deleted permanently!`
        });
    }
}


async function tellPlayerQueueIsReady() {

    const response = await fetch(`http://localhost:${process.env.MATCH_PLAYER_PORT}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "OK"
        })
    });

    console.log("response:", response.status);

    if (response.status != 200) {
        throw new RestError("Error with the match player", response.status);
    }

    const result = await response.json();
    console.log("result:", result);

}

export async function getFootballQueue(req: Request, res: Response, next: NextFunction) {
    //const ureq = (req as unknown) as UserRequest;

    //console.log("---> a ", ureq.user);

    const queue = await FootballRepo.getQueue();

    res.status(200).json(queue);
}