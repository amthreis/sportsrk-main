// sum.test.js
import { beforeAll, describe, expect, expectTypeOf, test } from "vitest";

import { getInfo } from "../src/services/svc-football";
import { GlobalInfo, zInfo } from "../src/entities/info";

import request from "supertest";

import app from "../src/app"

test('adds 1 + 2 to equal 3', () => {
    expect(3).toBe(3);
});

test("getInfo must be truthy", async () => {
    const info = await getInfo();

    console.log("info", info);
    expect(info).toBeTruthy();
});

describe('GetInfo via HTTP', async () => {

    beforeAll(() => {

    })
    const response = await request(app)
        .get("/common/football/info")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8");


    const result = await response.body;


    console.log("info", response.info);
    //console.log("headers", response.headers);
    //console.log("results", result);
    //console.log("res", response);
    expect(result).toBeTruthy();
    //expectTypeOf(result).toMatchTypeOf<GlobalInfo>();

    test("Zod must be able to parse result as GlobalInfo", () => {
        const parsed = zInfo.safeParse(result);
        console.log(parsed.error);
        expect(parsed.success).toBe(true);
    });

});
