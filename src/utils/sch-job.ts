import { faker } from "@faker-js/faker";
import { PlayerPos } from "../entities/player";
import prisma from "../prisma";
import { peek } from "../redis";
import schedule, { scheduleJob } from "node-schedule";
import { matchSimResolve } from "../controller/ctr-common-football";
import { mMake, mSim } from "../utils/sch-funcs";


function scheduleJobs() {
    console.log("starting scheduleJobs...");

    const job1 = scheduleJob(process.env.MATCHMAKE_CRON as string, () => {
        console.log(`every time cron = ${process.env.MATCHMAKE_CRON}, matchMake`, new Date());
        mMake();
    });

    scheduleJob(process.env.MATCHSIM_CRON as string, () => {
        console.log(`every time cron = ${process.env.MATCHSIM_CRON}, matchSim`, new Date());
        mSim();
    });

    //keep();
}



// function keep() {
//     setTimeout(() => {
//         keep();
//     }, 1000);
// }

scheduleJobs();

async function fasf() {

    const value = await peek("football:queue:open");

    console.log("is queue open:", value);
}
