import { NextFunction, Request, Response } from "express";
import { zodParse } from "../utils/utils-validation";
import { zMatchmakeData } from "../entities/matchmake";
import { FootballRepo } from "../repos/repo-football";
import { Player, PlayerAttrib, PlayerBasic, PlayerSide, PlayerUser, zPlayerSide } from "../entities/player";
import { MatchState, zResolvedFootballMatch } from "../entities/match";
import { MatchSide } from "@prisma/client";
import prisma from "../prisma";
import { resolve } from "../services/svc-football";

export async function matchmake(req: Request, res: Response, next: NextFunction) {
    const body = zodParse(zMatchmakeData, req.body, "Server couldn't validate the request's body");

    console.dir(body, {
        depth: 3
    });

    let i = 0;

    await prisma.$transaction(async (tr) => {
        for (let m of body.matches) {
            const players: (PlayerUser & PlayerBasic & PlayerAttrib & PlayerSide)[] = [];

            for (let h of m.home) {
                const p: Player = await FootballRepo.getPlayerByUserId(h, tr);

                const pData: PlayerUser & PlayerBasic & PlayerAttrib & PlayerSide = {
                    user: p.user,
                    pos: p.pos,
                    mmr: p.mmr,
                    attrib: p.attrib,
                    side: MatchSide.HOME
                };

                players.push(pData);
            }

            for (let a of m.away) {
                const p: Player = await FootballRepo.getPlayerByUserId(a, tr);

                const pData: PlayerUser & PlayerBasic & PlayerAttrib & PlayerSide = {
                    user: p.user,
                    pos: p.pos,
                    mmr: p.mmr,
                    attrib: p.attrib,
                    side: MatchSide.AWAY
                };

                players.push(pData);
            }

            await FootballRepo.createMatch({
                players
            }, tr);

            i++;
        }

        console.log(`${body.matches.length} matches have been created.`);

        res.status(200).json({
            message: `OK`
            // matchesArranged: body.matches.length,
            // unmatchedPlayers: body.unmatchedIds.length
        });
    });

}

export async function getTop100Players(req: Request, res: Response, next: NextFunction) {
    const players = await FootballRepo.getTop100Players(false);

    res.status(200).json(players);
}

export async function getLastMatches(req: Request, res: Response, next: NextFunction) {
    const matches = await FootballRepo.getLastMatches();

    res.status(200).json(matches);
}

export async function matchSimResolve(req: Request, res: Response, next: NextFunction) {

    //console.log(req.body);

    // const result = zResolvedFootballMatch.safeParse(req.body);

    const result = zodParse(zResolvedFootballMatch, req.body, "Couldn't parse the resolve matches list.");

    // console.log("1");

    // if (!result.success) {
    //     console.log(result.error);
    //     throw new Error("Couldn't parse the resolve matches list.");
    // }

    //  console.log("2");
    //const d = result.data;

    //console.log(result);

    await resolve(result);

    //console.log("3");
    res.status(200).json({ message: "ok" });

}