import { readdir } from "fs/promises";
import { benchmarkAsync } from "./benchmarks.js";
import { countUnique, countIn20, countInX } from "./fileWork.js";

const dir = "words";
const fileList = await readdir(dir);
const [d1, r1] = await benchmarkAsync("countUnique", () => countUnique(dir, fileList));
const [d2, r2] = await benchmarkAsync("countIn20", () => countIn20(dir, fileList));
const [d3, r3] = await benchmarkAsync("countInX", () => countInX(dir, fileList));
console.log(`Total: ${d1 + d2 + d3} ms`);
console.log(`Answers: ${r1}; ${r2}; ${r3}`);

