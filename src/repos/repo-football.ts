import prisma, { PrismaTransaction } from "../prisma";
import { CreatePlayerData, MatchSide, Player, PlayerBasic, PlayerSim, PlayerUser } from "../entities/player";
import { PlayerAlreadyExistsError, PlayerAlreadyInQueueError, PlayerNotFoundError, PlayerNotInQueueError } from "../errors/err-player";
import srandom from "../utils/srandom";
import { CreateFootballMatchData, Match, MatchId, MatchPlayer, MatchPlayers, MatchState, MatchEvents } from "../entities/match";
import cuid2 from "@paralleldrive/cuid2";
import { addMinutes } from "date-fns";
import { RestError } from "../errors/err-rest";

export namespace FootballRepo {
    export async function getAllPlayers(limit?: number, offset?: number, tr?: PrismaTransaction): Promise<Player[]> {
        const client = tr || prisma;

        //console.log("--get, hasTr:", tr !== undefined);
        const ply = await client.$queryRaw<Player[]>`
                select json_build_object(
                    'id',    main.user.id,
                    'email', main.user.email,
                    'role',  main.user.role,
                    'avatar', main.user.avatar
                ) as user,
                football.player.mmr, pos,
                json_build_object(
                    'finishing', football.attrib.finishing,
                    'passing', football.attrib.passing,
                    'dribbling', football.attrib.dribbling,
                    'aerial', football.attrib.aerial,
                    'marking', football.attrib.marking,
                    'goalkeeping', football.attrib.goalkeeping,
                    'pace', football.attrib.pace,
                    'resistance', football.attrib.resistance,
                    'workRate', football.attrib.work_rate,
                    'mentality', football.attrib.mentality
                )::jsonb as attrib,
                json_build_object(
                    'matches', (
                        select count(*) from football.match_player_stats
                        where football.match_player_stats.player_id = football.player.user_id
                        and (select state from football.match where football.match.id = football.match_player_stats.match_id)::text = 'DONE'
                    ),
                    'goals',  coalesce(sum(football.match_player_stats.goals),  0),
                    'shots',  coalesce(sum(football.match_player_stats.shots),  0),
                    'passes', coalesce(sum(football.match_player_stats.passes), 0)
                ) as stats
                from football.player
                join main.user on main.user.id = football.player.user_id
                left join football.attrib on main.user.id = football.attrib.user_id
                left join football.match_player_stats on main.user.id = football.match_player_stats.player_id
                group by main.user.id, football.player.user_id, football.attrib.user_id
                order by main.user.id
                offset ${offset} limit ${limit};
            `;

        //console.log(ply);
        //if (ply === null)
        //    throw new PlayerNotFoundError(`<Football> Player.User(${id}) doesn't exist.`);
        //throw new RestError();
        return ply;
    }


    export async function getTop100Players(showAttrib: boolean, tr?: PrismaTransaction): Promise<Player[]> {
        const client = tr || prisma;

        // await prisma.football_Player.findMany({
        //     where: {
        //         mmr: {
        //             gt: 100
        //         }
        //     }
        // });

        //console.log("--get, hasTr:", tr !== undefined);
        const ply = await client.$queryRaw<Player[]>`
                select json_build_object(
                    'id',    main.user.id,
                    'email', main.user.email,
                    'role',  main.user.role,
                    'avatar', main.user.avatar
                ) as user,
                mmr, mmr_incr as "mmrIncr", pos
                from football.player
                join main.user on main.user.id = football.player.user_id
                left join football.attrib on main.user.id = football.attrib.user_id
                left join football.match_player_stats on main.user.id = football.match_player_stats.player_id
                group by main.user.id, football.player.user_id, football.attrib.user_id
                order by player.mmr desc, main.user.id
                limit 100;
            `;

        //console.log(ply);
        //if (ply === null)
        //    throw new PlayerNotFoundError(`<Football> Player.User(${id}) doesn't exist.`);
        //throw new RestError();
        return ply;
    }

    export async function getInfo(tr?: PrismaTransaction): Promise<any> {
        const client = tr || prisma;

        const matches = await client.football_Match.findMany();

        const teamStats = await client.football_MatchTeamStats.findMany();


        const goals = teamStats.map(tS => tS.goals).reduce((acc, curr) => {
            return acc + curr;
        }, 0);

        const tackles = teamStats.map(tS => tS.tackles).reduce((acc, curr) => {
            return acc + curr;
        }, 0);


        return {
            matches: {
                all: matches.length,
                done: matches.filter(m => m.state === MatchState.DONE).length,
                tbp: matches.filter(m => m.state === MatchState.TBP).length,
                happening: matches.filter(m => m.state === MatchState.HAPPENING).length
            },
            stats: {
                goals: goals,
                tackles: tackles
            }
        };
    }

    export async function getMatchesToBeSimmed(tr?: PrismaTransaction): Promise<(MatchId & MatchPlayers)[]> {
        const client = tr || prisma;

        const matchIds = await client.$queryRaw<any[]>`
                 select array_agg(id) as ids from football.match
                 where state = 'TBP';
             `;

        //console.log("matchIds", matchIds[0].ids);

        if (!matchIds[0].ids)
            throw new RestError("No matches to be simulated.");

        //console.log(matchIds[0].ids);

        const matches: (MatchId & MatchPlayers)[] = [];
        const invalidMatches: (MatchId & MatchPlayers)[] = [];

        for (let matchId of matchIds[0].ids) {
            const m = await client.$queryRaw<MatchPlayer[]>`
                select json_build_object(
                    'id', main.user.id,
                    'email', main.user.email,
                    'role', main.user.role,
                    'avatar', main.user.avatar
                    ) as user, 
                    json_build_object(
                        'finishing', football.attrib.finishing,
                        'passing', football.attrib.passing,
                        'dribbling', football.attrib.dribbling,
                        'aerial', football.attrib.aerial,
                        'marking', football.attrib.marking,
                        'goalkeeping', football.attrib.goalkeeping,
                        'pace', football.attrib.pace,
                        'resistance', football.attrib.resistance,
                        'workRate', football.attrib.work_rate,
                        'mentality', football.attrib.mentality
                    )::jsonb as attrib,
                    football.player.pos, football.player.mmr, side from football.match_player_stats
                    join football.player on football.player.user_id = football.match_player_stats.player_id
                    join football.attrib on football.attrib.user_id = football.match_player_stats.player_id
                    join main.user on main.user.id = football.match_player_stats.player_id
                where match_id = ${matchId};
            `;


            if (m.length >= 22) {

                matches.push({
                    id: matchId,
                    players: m
                });
            } else {
                invalidMatches.push({
                    id: matchId,
                    players: m
                });
            }

        }


        //throw new RestError();

        //console.log(ply);
        //if (ply === null)
        //    throw new PlayerNotFoundError(`<Football> Player.User(${id}) doesn't exist.`);
        //throw new RestError();
        console.log(`Valid matches: ${matches.length}/${matches.length + invalidMatches.length}`);
        return matches;
    }


    export async function getLastMatches(tr: PrismaTransaction | undefined = undefined): Promise<Match[]> {
        const client = tr || prisma;

        const matches = await client.$queryRaw<Match[]>`
            select football.match.*,
                (
                    select avg(football.match_player_stats.mmr) 
                        from football.match_player_stats 
                    where football.match_player_stats.match_id = football.match.id
                ) as avgmmr,
                json_build_object(
                    'teams', array_agg(json_build_object(
                        'matchId', football.match_team_stats.match_id,
                        'goals', football.match_team_stats.goals,
                        'side', football.match_team_stats.side
                    ))
                ) as data
            from football.match
                join football.match_team_stats on football.match_team_stats.match_id = football.match.id                    
                where state = 'DONE'
                group by football.match.id
                order by time DESC
                limit 15;
        `;



        for (const m of matches) {
            const events = await client.$queryRaw`
                SELECT main.user.email as player, football.player.pos as playerPos,  time, side, type FROM football.match_event
                join main.user on main.user.id = football.match_event.player_id
                join football.player on football.player.user_id = football.match_event.player_id
                    where match_id = ${m.id}
                ORDER BY match_id, time, football.match_event.id ASC
            `;

            //console.log(`events of ${m.id}:`, events);

            (m as any).events = events;
        }

        /*
                const matches = await client.$queryRaw<Match[]>`
                    select football.match.*,
                        json_build_object(
                            'teams', array_agg(football.match_team_stats.*)
                            )::jsonb as data,
                        array(
                            select * from football.match_player_stats mps where mps.player_id = football.match.id
                        ) as players
                    from football.match
                        join football.match_team_stats using football.match_team_stats.match_id = football.match.id
                        where state = 'DONE'
                        group by football.match.id
                        order by time
                        fetch first 1 row with ties;
                `;
        */
        return matches;
    }

    export async function getPlayerByUserId(id: string, tr: PrismaTransaction | undefined = undefined): Promise<Player> {
        const client = tr || prisma;

        const ply = await client.$queryRaw<Player[]>`
                select json_build_object(
                    'id', main.user.id,
                    'email', main.user.email,
                    'role', main.user.role
                ) as user,
                mmr, pos from football.player
                join main.user on main.user.id = football.player.user_id
                where main.user.id = ${id}
                limit 1;
            `;

        if (ply === null || ply.length === 0)
            throw new PlayerNotFoundError(`<Football> Player.User(${id}) doesn't exist.`);

        return ply[0];
    }

    export async function tryGetPlayerByUserId(id: string, tr: PrismaTransaction | undefined = undefined): Promise<Player | null> {
        const client = tr || prisma;

        const ply = await client.$queryRaw<Player[]>`
                select json_build_object(
                    'id', main.user.id,
                    'email', main.user.email,
                    'role', main.user.role
                ) as user,
                mmr, pos from football.player
                join main.user on main.user.id = football.player.user_id
                where main.user.id = ${id}
                limit 1;
            `;

        //if (ply === null)
        //    throw new PlayerNotFoundError(`<Football> Player.User(${id}) doesn't exist.`);

        return ply.length > 0 ? ply[0] : null;
    }

    export async function setPlayerMMR(player: PlayerUser, mmr: number) {
        await prisma.football_Player.update({
            data: {
                mmr
            },
            where: {
                userId: player.user.id
            }
        });
    }

    export async function createMatch(data: CreateFootballMatchData, tr?: PrismaTransaction): Promise<{ id: string; state: MatchState }> {
        const client = tr || prisma;

        const m = await client.football_Match.create({
            data: {
                id: cuid2.createId(),
                state: MatchState.TBP
            }
        });

        for (const p of data.players) {
            await client.$queryRaw`
                insert into football.match_player_stats (match_id, player_id, side, mmr) values (${m.id}, ${p.user.id}, ${p.side === "AWAY" ? "AWAY" : "HOME"}::"MatchSide", ${p.mmr});
            `;
        }

        return m;
    }

    export async function createPlayer(data: CreatePlayerData): Promise<Player> {
        const player = await tryGetPlayerByUserId(data.user.id);

        //console.log("PLAYER", player);

        if (player !== null)
            throw new PlayerAlreadyExistsError();
        // else
        //     throw new PlayerNotFoundError();

        //console.log("creat", data);
        const p = await prisma.football_Player.create({
            data: {
                userId: data.user.id,
                pos: data.pos,
                attrib: {
                    create: {
                        finishing: Math.floor(1 + srandom() * 9),
                        passing: Math.floor(1 + srandom() * 9),
                        dribbling: Math.floor(1 + srandom() * 9),
                        aerial: Math.floor(1 + srandom() * 9),
                        marking: Math.floor(1 + srandom() * 9),
                        goalkeeping: Math.floor(1 + srandom() * 9),
                        pace: Math.floor(1 + srandom() * 9),
                        resistance: Math.floor(1 + srandom() * 9),
                        workRate: Math.floor(1 + srandom() * 9),
                        mentality: Math.floor(1 + srandom() * 9)
                    }
                }
            }
        });

        //console.log("retr");
        const ply = await tryGetPlayerByUserId(data.user.id);

        if (ply !== null) {
            return ply;
        } {
            throw new Error("Something went wrong while creating a football player.");
        }

        //return null;

    }

    export async function getQueue(tr?: PrismaTransaction): Promise<(PlayerUser & PlayerBasic)[]> {
        const client = tr || prisma;

        //const queuePly = await prisma.football_Queue.findMany();

        const ply = await client.$queryRaw<(PlayerUser & PlayerBasic)[]>`
            select json_build_object(
                'id', main.user.id,
                'email', main.user.email,
                'role', main.user.role
            ) as user,
            mmr, pos from football.queue
            join main.user on main.user.id = football.queue.player_user_id;
        `;

        return ply;
    }

    export async function removeFromQueue(ply: PlayerUser) {
        const queuePly = await prisma.football_Queue.findUnique({
            where: { userId: ply.user.id }
        });

        if (queuePly === null)
            throw new PlayerNotInQueueError(`Player.User(${ply.user.email}) is not in the Queue.`);

        await prisma.football_Queue.delete({
            where: {
                userId: ply.user.id
            }
        });
    }

    export async function addToQueue(ply: PlayerUser & PlayerBasic) {
        const queuePly = await prisma.football_Queue.findUnique({
            where: { userId: ply.user.id }
        });

        if (queuePly !== null)
            throw new PlayerAlreadyInQueueError(`Player.User(${ply.user.email}) is already in the queue.`);

        await prisma.football_Queue.create({
            data: {
                player: {
                    connect: {
                        userId: ply.user.id
                    }
                },
                mmr: ply.mmr,
                pos: ply.pos
            }
        });
    }
}