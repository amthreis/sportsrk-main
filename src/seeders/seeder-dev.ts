import { UserRole } from "../entities/user";
import { UserRepo } from "../repos/repo-user";

import { faker } from "@faker-js/faker";
import srandom, { anyPos } from "../utils/srandom";
import { PlayerPos } from "../entities/player";
import { FootballRepo } from "../repos/repo-football";
import { exit } from "process";
import * as redis from "../redis";

async function main() {

    console.log("Start seeding...");

    const users = [];

    await UserRepo.create("admin@m.com", UserRole.ADMIN);
    await UserRepo.create("dev_matheus@m.com", UserRole.DEV);
    await FootballRepo.setFootballQueueState(false);

    for (let i = 0; i < 250; i++) {
        const email = faker.internet.email();

        const user = await UserRepo.create(email, UserRole.USER);
        const ply = await FootballRepo.createPlayer({
            user: {
                email: user.email,
                id: user.id,
                role: user.role
            },
            pos: anyPos(PlayerPos)
        });

        await FootballRepo.setPlayerMMR(ply, 1000 + srandom() * 9000);
    }

    await redis.push("main:sch-jobs", false);
    await FootballRepo.setFootballQueueState(false);

    console.log("... done seeding!");

    exit(0);
}


main();