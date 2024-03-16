
import { configDotenv } from 'dotenv';
configDotenv({ path: "../.env.test" });

import { execSync } from 'node:child_process';
import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig } from '@jest/environment';
import type { EnvironmentContext } from '@jest/environment';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function generateDatabaseURL() {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL environment variable.');
    }

    const dbUrl = process.env.DATABASE_URL;
    const indexOfSchema = dbUrl.split("?");

    //console.log(indexOfSchema);

    return indexOfSchema[0]  + "_test";
}

function formatDate(date: Date) {
    return `${ date.getFullYear() }.${ p(date.getMonth() + 1) }.${ p(date.getDate()) }_${ p(date.getHours()) }:${ p(date.getMinutes()) }:${ p(date.getSeconds()) }`;
}

function p(value: number) : string {
    return value.toString().padStart(2, "0");
}

export default class PrismaTestEnvironment extends NodeEnvironment {
    private schema: string;

    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context);
        this.schema = `test_${ formatDate(new Date()) }`;
    }

    async setup() {
        const databaseURL = generateDatabaseURL() + "?schema=main";

        //console.log(databaseURL);

        //const dbUrl = process.env.DATABASE_URL + "_test";

        process.env.DATABASE_URL = databaseURL;
        this.global.process.env.DATABASE_URL = databaseURL;
        
        process.env.NODE_ENV = "test_e2e";
        this.global.process.env.NODE_ENV = "test_e2e";

        //console.log("------------------- process.env.NODE_ENV", process.env.NODE_ENV);
        //console.log("------------------- process.env.DATABASE_URL", process.env.DATABASE_URL);

        //await this.clear();

        execSync('npx prisma db push --force-reset');
    }

    async clear() {
        await prisma.$transaction(async (tr) => {
            const drops: any = await tr.$queryRaw`
                SELECT
                    array_agg('DROP SCHEMA IF EXISTS "' || schema_name || '" CASCADE;') 
                from information_schema.schemata 
                    WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                    GROUP BY schema_name
                    ORDER BY schema_name ASC;
            `;

            const schemasToDelete = drops.map((d: any) => d.array_agg[0]);

            console.log("drops: ", schemasToDelete);

            for(const sch of schemasToDelete)
                await tr.$queryRawUnsafe(sch);
        });
    }

  async teardown() {
    //const maxHC = Number(process.env.SCHEMA_HISTORY_MAX_COUNT);
    //console.log("maxHC", maxHC);
/*
    await prisma.$transaction(async (tr) => {
        const data2 = await tr.$queryRaw`
            SELECT COUNT(schema_name) FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast');
        `;

        const anyData = data2 as any;

        let count = Number(anyData[0].count ) - maxHC;
        //console.log(count);

        if (count > 0) {
            const drops: any = await tr.$queryRaw`
                SELECT
                    array_agg('DROP SCHEMA IF EXISTS "' || schema_name || '" CASCADE;') 
                from information_schema.schemata 
                    WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                    GROUP BY schema_name
                    ORDER BY schema_name ASC
                    LIMIT ${ count };
            `;

            const schemasToDelete = drops.map((d: any) => d.array_agg[0]);

            console.log("drops: ", schemasToDelete);

            for(const sch of schemasToDelete)
                await tr.$queryRawUnsafe(sch);
        }

    });
*/

    await prisma.$disconnect();
  }
}