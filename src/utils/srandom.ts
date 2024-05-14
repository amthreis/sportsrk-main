import { PlayerPos } from "../entities/player";

let seed = 1095;

function srandom() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export default srandom;

export function anyPos<T>(anEnum: T): T[keyof T] {
    //save enums inside array
    const enumValues = Object.keys(PlayerPos) as Array<keyof T>;

    //Generate a random index (max is array length)
    const randomIndex = Math.floor(srandom() * enumValues.length);
    // get the random enum value

    const randomEnumKey = enumValues[randomIndex];
    return anEnum[randomEnumKey];
    // if you want to have the key than return randomEnumKey
}
