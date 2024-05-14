import z from "zod";

import { UserRole as PrismaUserRole } from '@prisma/client';
import { Iat } from "./other";

export const UserRole = {
    USER: PrismaUserRole.USER,
    ADMIN: PrismaUserRole.ADMIN,
    DEV: PrismaUserRole.DEV,
    GUEST: PrismaUserRole.GUEST
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

const userRolePriority = {
    [UserRole.ADMIN]: 5,
    [UserRole.DEV]: 3,
    [UserRole.USER]: 2,
    [UserRole.GUEST]: 1
};

export function getUserRolePriority(role: UserRole) {
    return userRolePriority[role];
}

export const zUser = z.object({
    id: z.string().cuid2(),
    email: z.string().email(),
    role: z.nativeEnum(UserRole)
});

export type User = z.infer<typeof zUser>;

export const zSetSchJobs = z.object({
    enable: z.boolean()
}).strict();

export const zUserSignup = z.object({
    email: z.string().email()
}).strict();

export const zUserLogin = z.object({
    email: z.string().email()
}).strict();



export interface UserRequest extends Request {
    user: User & Iat
}