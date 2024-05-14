import z from "zod";

export const zIat = z.object({ iat: z.number() });

export type Iat = z.infer<typeof zIat>;