import { application } from "express";
import { createClient } from "redis";
import { RedisError } from "./errors/err-redis";
import { AnyARecord } from "dns";

export const publisher = createClient({
    socket: {
        port: Number(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST
    }
});

console.log(`Connected to redis @ ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

const listener = publisher.duplicate();

publisher.connect();
listener.connect();

publisher.on("error", (error) => {
    //console.log("oaijsd");

    console.log(error);
    process.kill(process.pid, 'SIGTERM');
    //process.exit(1);
    //console.log("---");
});

export async function push(key: string, value: any) {
    return await publisher.lPush(key, JSON.stringify(value));
}
export async function rpop(key: string) {
    return await publisher.rPop(key);
}

export async function pop(key: string) {
    const v = await publisher.rPop(key);
    return v ? JSON.parse(v) : null;
}

export async function peek(key: string) {
    const v = (await publisher.lRange(key, 0, 0) as any[])[0];

    //console.log(v);

    return v ? JSON.parse(v) : null;
}


export async function clear(key: string) {
    return await publisher.del(key);
}

export async function pub(channel: string, value: any) {
    const p = await publisher.publish(channel, JSON.stringify(value));
    console.log(`Message sent (ch: ${channel}, value: ${typeof value}).`);
    return p;
}

export async function sub(channel: string, callback: (value: any, ch: string) => void) {
    await listener.subscribe(channel, callback);
}

