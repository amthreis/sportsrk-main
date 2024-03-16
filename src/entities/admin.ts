import z from "zod";

export const zAdminDeleteUserData = z.object({
    id: z.string().cuid2(),
    email: z.string().email(),
})
    .partial()
    .refine(
        data => data.id || data.email, 'Either first or second should be filled in.',
    );

export type AdminDeleteUserData = z.infer<typeof zAdminDeleteUserData>;

export const zAdminSetQueueState = z.object({
    open: z.boolean()
});