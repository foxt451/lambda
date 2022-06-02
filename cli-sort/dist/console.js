// @ts-ignore
// no type definitions for promises interface for some reason
import * as readline from "node:readline/promises";
const getArray = async () => {
    const input = await ask(getArrayPrompt);
    const arr = input.split(" ").map((value) => {
        const transformed = Number(value);
        if (isNaN(transformed))
            return value;
        return transformed;
    });
    return arr;
};
const getArrayPrompt = "Please, enter some numbers and strings separated by spaces (in one line):\n";
const anyKey = () => {
    console.log("Press any key to continue...");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    return new Promise((resolve) => process.stdin.once("data", () => {
        process.stdin.setRawMode(false);
        resolve();
    }));
};
const ask = async (prompt) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const answer = await rl.question(prompt);
    rl.close();
    return answer;
};
const askForOp = async (ops) => {
    console.log("Please, choose one of the following operations:");
    const opMsg = Object.entries(ops)
        .map(([key, value]) => `${key}: ${value.desc}`)
        .join("\n") + "\n";
    while (true) {
        const result = await ask(opMsg);
        if (result in ops) {
            return result;
        }
        console.log("Uknown option. Try again please:");
    }
};
export { getArray, ask, askForOp, anyKey };
