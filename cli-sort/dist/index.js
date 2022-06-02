import { getArray, askForOp, anyKey } from "./console.js";
import ops from "./ops.js";
const arr = await getArray();
console.log(arr);
while (true) {
    const op = await askForOp(ops);
    const modified = ops[op].fn(arr);
    console.log(modified);
    await anyKey();
}
