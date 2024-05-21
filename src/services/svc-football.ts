import { MatchSide, MatchState } from "@prisma/client";
import { ResolvedFootballMatch } from "../entities/match";
import prisma from "../prisma";
import { FootballRepo } from "../repos/repo-football";
import cuid2 from "@paralleldrive/cuid2";


export async function resolve(m: ResolvedFootballMatch) {
    console.log(`resolved.match(${m.id}): home ${m.home.goals} x ${m.away.goals} away`);

    //console.log(m.events);
    //console.log("players[0]", m.players[0]);

    await prisma.$transaction(async (tr) => {
        await tr.football_Match.update({
            where: { id: m.id },
            data: {
                state: MatchState.DONE
            }
        });

        await tr.football_MatchTeamStats.upsert({
            where: { matchId_side: { matchId: m.id, side: MatchSide.HOME } },
            create: {
                ...m.home,
                matchId: m.id, side: MatchSide.HOME
            },
            update: { ...m.home }
        });

        await tr.football_MatchTeamStats.upsert({
            where: { matchId_side: { matchId: m.id, side: MatchSide.AWAY } },
            create: {
                ...m.away,
                matchId: m.id, side: MatchSide.AWAY
            },
            update: { ...m.away }
        });

        for (const p of m.players) {
            await tr.football_MatchPlayerStats.update({
                where: { matchId_playerId: { matchId: m.id, playerId: p.userId } },
                data: { ...p.stats }
            });

            const ply = await tr.football_Player.findUnique({
                where: {
                    userId: p.userId
                },
                select: {
                    mmr: true
                }
            });


            await tr.football_Player.update({
                data: {
                    mmr: (ply?.mmr || 0) + p.mmrIncr,
                    mmrIncr: p.mmrIncr
                },
                where: {
                    userId: p.userId
                }
            });
        }

        for (const e of m.events) {
            await tr.football_MatchEvent.create({
                data: {
                    id: cuid2.createId(),
                    matchId: m.id,
                    playerId: e.playerId,
                    side: e.side,
                    type: e.type,
                    time: e.time
                }
            });
        }
    });

    console.log("woda");
}



export async function getInfo(): Promise<any> {
    return await FootballRepo.getInfo();

}