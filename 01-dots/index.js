import dots from "./dots.js";

console.log(dots("abcde"));

import dotsGen from "./dotsGen.js";

const str = "a".repeat(100);
const gen = dotsGen(str);
while (true) {
    console.log(gen.next().value);
}