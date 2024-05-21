
import z from "zod";

export const zInfo = z.object({
    schJobs: z.boolean(),
    football: z.object({
        queue: z.object({
            state: z.boolean(),
            count: z.number().nonnegative()
        }),
        matches: z.object({
            all: z.number().nonnegative(),
            done: z.number().nonnegative(),
            tbp: z.number().nonnegative(),
            happening: z.number().nonnegative(),
        }),
        stats: z.object({
            goals: z.number().nonnegative(),
            tackles: z.number().nonnegative()
        }),
        players: z.number().nonnegative()
    })
});

export type GlobalInfo = z.infer<typeof zInfo>;