import cuid2 from "@paralleldrive/cuid2";
import { RestError } from "../errors/err-rest";
import { UserAlreadyExistsError, UserNotFoundError } from "../errors/err-user";
import prisma from "../prisma";
import { User, UserRole } from "../entities/user";
import { Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

export namespace UserRepo {
    export async function getAll(): Promise<User[]> {
        const users = await prisma.user.findMany();

        return users;
    }

    export async function tryGetById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        console.log("user", user);

        return user;
    }

    export async function getById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (user === null)
            throw new UserNotFoundError(`User(${id}) doesn't exist.`);

        return user;
    }

    export async function tryGetByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        return user;
    }

    export async function getByEmail(email: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user === null)
            throw new UserNotFoundError(`User(${email}) doesn't exist.`);

        return user;
    }

    export async function deleteByEmail(email: string) {
        if (await tryGetByEmail(email) === null)
            throw new UserNotFoundError(`User(${email}) doesn't exist.`);

        await prisma.user.delete({
            where: {
                email: email
            }
        });
    }

    export async function deleteById(id: string) {
        console.log("tryget ", id);
        if (await tryGetById(id) === null)
            throw new UserNotFoundError(`User(${id}) doesn't exist.`);

        console.log("got ");
        await prisma.user.delete({
            where: {
                id: id
            }
        });
        console.log("del ");
    }

    export async function create(email: string, role: UserRole): Promise<User> {
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    id: cuid2.createId(),
                    role,
                    avatar: faker.image.avatarLegacy()
                }
            });

            console.log("user", user);

            return user;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new UserAlreadyExistsError("There's a User registered with this email already.");
                }
            }

            throw new RestError();
        }
    }
}