
import { config } from "dotenv";
config({});

import { scheduleJob } from "node-schedule";

import { mMake, mSim } from "./sch-funcs";
import { peek } from "../redis";

export async function scheduleJobs() {
    const doIt = await peek("main:sch-jobs");
    console.log("starting scheduleJobs... enabled:", doIt);

    const job1 = scheduleJob(process.env.MATCHMAKE_CRON as string, async () => {
        const doIt = await peek("main:sch-jobs");

        if (doIt) {
            console.log(`every time cron = ${process.env.MATCHMAKE_CRON}, matchMake`, new Date());
            mMake();
        }
    });

    scheduleJob(process.env.MATCHSIM_CRON as string, async () => {
        const doIt = await peek("main:sch-jobs");

        if (doIt) {
            console.log(`every time cron = ${process.env.MATCHSIM_CRON}, matchSim`, new Date());
            mSim();
        }
    });

    //keep();
}