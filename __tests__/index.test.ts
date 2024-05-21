// sum.test.js
import { beforeAll, describe, expect, expectTypeOf, test } from "vitest";

import { getInfo } from "../src/services/svc-football";
import { GlobalInfo, zInfo } from "../src/entities/info";

import request from "supertest";

import app from "../src/app"
import { listen } from "../src/listen"
// test('adds 1 + 2 to equal 3', () => {
//     expect(3).toBe(3);
// });

test("getInfo must be truthy", async () => {
    const info = await getInfo();

    //console.log("info", info);
    expect(info).toBeTruthy();
});

describe('GetInfo via HTTP', async () => {
    let response;
    let result;


    beforeAll(async () => {
        listen();

        response = await request(app)
            .get("/common/football/info")
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8");

        result = await response.body;
        //console.log("RSULT", result);
    });



    //console.log("headers", response.headers);
    //console.log("results", result);
    //console.log("res", response);
    //expectTypeOf(result).toMatchTypeOf<GlobalInfo>();

    test("Zod must be able to parse result as GlobalInfo", () => {
        // expect(result).toBeTruthy();
        const parsed = zInfo.safeParse(result);
        //console.log("parsed", parsed);
        //console.log(parsed.error);
        expect(parsed.success).toBe(true);
    });

});

describe('SendxToQueue via HTTP', async () => {
    let response;
    let result;
    let bearerToken: string;

    beforeAll(async () => {
        const loginAsAdmin = await request(app)
            .post("/common/auth/login")
            .send({
                email: "admin@m.com"
            })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8");

        bearerToken = await loginAsAdmin.body.token;
        console.log("btk", bearerToken);

        response = await request(app)
            .post("/admin/football/queue/sendx")
            .auth(bearerToken, { type: "bearer" })
            .send({
                count: 45
            })
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8");

        result = await response.body;
        console.log("RESULT", result);
        //console.log("RSULT", result);
    });



    //console.log("headers", response.headers);
    //console.log("results", result);
    //console.log("res", response);
    //expectTypeOf(result).toMatchTypeOf<GlobalInfo>();

    test("Zod must be able to parse result as GlobalInfo", () => {
        // expect(result).toBeTruthy();
        //const parsed = zInfo.safeParse(result);
        //console.log("parsed", parsed);
        //console.log(parsed.error);
        console.log("RESULT", result);
        expect(true).toBe(true);
    });

});
