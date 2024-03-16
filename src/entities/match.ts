import { MatchState as PrismaMatchState, MatchEvent as PrismaMatchEvent } from '@prisma/client';

import z from "zod";
import { MatchSide, PlayerStats, PlayerUser, zPlayerAttrib, zPlayerBasic, zPlayerMMRIncr, zPlayerPos, zPlayerSide, zPlayerStats, zPlayerUser, zStats } from './player';

export const MatchState = {
    TBP: PrismaMatchState.TBP,
    HAPPENING: PrismaMatchState.HAPPENING,
    DONE: PrismaMatchState.DONE
} as const;

export const MatchEvent = {
    GOAL: PrismaMatchEvent.GOAL,
    REDCARD: PrismaMatchEvent.REDCARD,
    YELLOWCARD: PrismaMatchEvent.YELLOWCARD
} as const;


export type MatchState = typeof MatchState[keyof typeof MatchState];

export const zCreateFootballMatchData = z.object({
    players: z.array(zPlayerUser.and(zPlayerSide))
});

export type CreateFootballMatchData = z.infer<typeof zCreateFootballMatchData>;


export const zMatchId = z.object({
    id: z.string().cuid2()
});

export const zMatchTime = z.object({
    time: z.date()
});

export const zMatchPlayer = zPlayerUser.and(zPlayerAttrib).and(zPlayerSide).and(zPlayerBasic);

export const zResolvedMatchPlayer = z.object({ userId: z.string().cuid2() }).and(zPlayerSide).and(zPlayerStats).and(zPlayerMMRIncr);

export const zMatchPlayers = z.object({
    players: z.array(zMatchPlayer).optional()
});

export const zMatchEvent = z.object({
    time: z.number(),
    playerId: z.string().cuid2(),
    type: z.nativeEnum(MatchEvent),
    side: z.nativeEnum(MatchSide)
});

export const zMatchEvents = z.object({
    events: z.array(zMatchEvent)
});

export type MatchId = z.infer<typeof zMatchId>;
export type MatchPlayers = z.infer<typeof zMatchPlayers>;
export type MatchTime = z.infer<typeof zMatchTime>;
export type MatchEvents = z.infer<typeof zMatchEvents>;

export type Match = MatchId & MatchPlayers & MatchEvents;

export type MatchPlayer = z.infer<typeof zMatchPlayer>;

export type ResolvedMatchPlayer = z.infer<typeof zResolvedMatchPlayer>;
export type ResolvedFootballMatch = z.infer<typeof zResolvedFootballMatch>;

export type MatchEvent = z.infer<typeof zMatchEvent>;

export const zResolvedFootballMatch = z.object({
    id: z.string().cuid2(),
    home: zStats,
    away: zStats,
    players: z.array(zResolvedMatchPlayer),
    events: z.array(zMatchEvent)
});