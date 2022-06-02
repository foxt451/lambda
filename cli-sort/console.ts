// @ts-ignore
// no type definitions for promises interface for some reason
import * as readline from "node:readline/promises";

const getArray = async (): Promise<(number | string)[]> => {
  const input: string = await ask(getArrayPrompt);
  const arr: (string | number)[] = input.split(" ").map((value: string) => {
    const transformed = Number(value);
    if (isNaN(transformed)) return value;
    return transformed;
  });
  return arr;
};
const getArrayPrompt: string =
  "Please, enter some numbers and strings separated by spaces (in one line):\n";

const anyKey = (): Promise<void> => {
  console.log("Press any key to continue...");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

const ask = async (prompt: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer: string = await rl.question(prompt);
  rl.close();
  return answer;
};

interface Ops {
  [key: string]: { desc: string };
}
const askForOp = async <T extends Ops>(ops: T): Promise<keyof T> => {
  console.log("Please, choose one of the following operations:");

  const opMsg: string =
    Object.entries(ops)
      .map(([key, value]) => `${key}: ${value.desc}`)
      .join("\n") + "\n";

  while (true) {
    const result: string = await ask(opMsg);
    if (result in ops) {
      return result;
    }
    console.log("Uknown option. Try again please:");
  }
};

export { getArray, ask, askForOp, anyKey };
