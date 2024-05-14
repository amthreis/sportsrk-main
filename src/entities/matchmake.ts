
import z from "zod";

const zMatchOTD = z.object({
    home: z.array(z.string().cuid2()),
    away: z.array(z.string().cuid2())
});

export const zMatchmakeData = z.object({
    matches: z.array(zMatchOTD),
    unmatchedIds: z.array(z.string().cuid2())
});

export type MatchmakeData = z.infer<typeof zMatchmakeData>;