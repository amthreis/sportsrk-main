// sum.test.js
import { expect, expectTypeOf, test } from "vitest";

import { getInfo } from "../src/services/svc-football";
import { push, peek, pop, rpop } from "../src/redis";
import { boolean } from "zod";


test("must be able to set 'test:my-number' in redis db", async () => {
    await push("test:my-number", 255);
});

test("must be able to peek 'test:my-number'", async () => {
    const value = await peek("test:my-number");

    expect(value).toBe(255);
});

test("must be able pop 'test:my-number' because peek doesn't remove the key", async () => {
    const value = await pop("test:my-number");

    expect(value).toBeTypeOf("number");
    expect(value).toBe(255);
});

test("'test:my-number' must NOT exist after popping it", async () => {
    const value = await pop("test:my-number");

    expect(value).toBe(null);
});

test("rpop should be able to parse 'true/false' to boolean", async () => {
    await push("test:my-boolean", true);
    const value = await peek("test:my-boolean");

    expect(value).toBeTypeOf("boolean");
});

test("rpop should be able to parse objects", async () => {
    type Person = {
        name: string;
        age: number;
        isMale: boolean;

        address: {
            street: string;
            number: number;
        }
    }

    const person: Person = {
        name: "Matheus",
        age: 28,
        isMale: true,

        address: {
            street: "Main Avenue",
            number: 298
        }
    };

    await push("test:my-person", person);
    const value = await peek("test:my-person");

    console.log("person", value);
    expectTypeOf(value).toMatchTypeOf<Person>();
});

