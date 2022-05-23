import { createReadStream } from "fs";
import { createInterface } from "readline";

const parseCsv = async (path, rowCb) => {
  const fStream = createReadStream(path);
  const rl = createInterface({
    input: fStream,
  });
  for await (const row of rl) {
    const parsed = row.split(",").map((cell) => cell.slice(1, -1));
    rowCb(parsed);
  }
};

export { parseCsv };
