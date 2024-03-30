import z from "zod";
import { zUser } from "./user";
import { PlayerPos as PrismaPlayerPos } from "@prisma/client";
import { MatchSide as PrismaMatchSide } from "@prisma/client";

export const PlayerPos = {
    GK: PrismaPlayerPos.GK,
    FB: PrismaPlayerPos.FB,
    CB: PrismaPlayerPos.CB,
    DM: PrismaPlayerPos.DM,
    LM: PrismaPlayerPos.LM,
    AM: PrismaPlayerPos.AM,
    WG: PrismaPlayerPos.WG,
    ST: PrismaPlayerPos.ST
} as const;

export const MatchSide = {
    HOME: PrismaMatchSide.HOME,
    AWAY: PrismaMatchSide.AWAY
} as const;

export const zStats = z.object({
    goals: z.number().nonnegative(),
    shots: z.number().nonnegative(),
    shotsOnTarget: z.number().nonnegative(),
    blocks: z.number().nonnegative(),
    gkSaves: z.number().nonnegative(),
    passesAttempted: z.number().nonnegative(),
    passes: z.number().nonnegative(),
    interceptions: z.number().nonnegative(),
    tackles: z.number().nonnegative(),
    aerials: z.number().nonnegative(),
    aerialsWon: z.number().nonnegative(),
    dribblesAttempted: z.number().nonnegative(),
    dribbles: z.number().nonnegative(),
    cornerKicks: z.number().nonnegative(),
    cleared: z.number().nonnegative()
});

const zAttrib = z.object({
    finishing: z.number().min(1).max(10),
    passing: z.number().min(1).max(10),
    dribbling: z.number().min(1).max(10),
    aerial: z.number().min(1).max(10),
    marking: z.number().min(1).max(10),
    goalkeeping: z.number().min(1).max(10),
    pace: z.number().min(1).max(10),
    resistance: z.number().min(1).max(10),
    workRate: z.number().min(1).max(10),
    mentality: z.number().min(1).max(10)
});

export const zPlayerUser = z.object({
    user: zUser
});

export const zPlayerBasic = z.object({
    mmr: z.number(),
    pos: z.nativeEnum(PlayerPos)
});

export const zPlayerPos = z.object({
    pos: z.nativeEnum(PlayerPos)
});

export const zPlayerStats = z.object({
    stats: zStats
});

export const zPlayerMMRIncr = z.object({
    mmrIncr: z.number()
});

export const zPlayerMMR = z.object({
    mmr: z.number()
});

export const zPlayerSide = z.object({
    side: z.nativeEnum(MatchSide)
});



export const zPlayerAttrib = z.object({
    attrib: zAttrib
});

export const zCreatePlayerData = z.object({
    user: zUser,
    pos: z.nativeEnum(PlayerPos).default(PlayerPos.GK)
}).strict();


export type PlayerUser = z.infer<typeof zPlayerUser>;
export type PlayerBasic = z.infer<typeof zPlayerBasic>;
export type PlayerSide = z.infer<typeof zPlayerSide>;

export type Player = PlayerUser & PlayerBasic & PlayerAttrib & PlayerStats;

export type PlayerAttrib = z.infer<typeof zPlayerAttrib>;
export type PlayerStats = z.infer<typeof zPlayerStats>;

export type CreatePlayerData = z.infer<typeof zCreatePlayerData>;

export type PlayerSim = PlayerUser & PlayerBasic & PlayerAttrib;