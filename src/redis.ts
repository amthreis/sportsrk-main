import { application } from "express";
import { createClient } from "redis";

export const publisher = createClient({
    socket: {
        port: 6379,
        host: "localhost"
    }
});

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

export async function lpush(key: string, value: any) {
    return await publisher.lPush(key, JSON.stringify(value));
}
export async function rpop(key: string) {
    return await publisher.rPop(key);
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
