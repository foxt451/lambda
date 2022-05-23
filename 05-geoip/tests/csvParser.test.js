import { parseCsv } from "../utils/csvParser.js";

const fakeCsvPath = "tests/fakeCsv.csv";
test("parses correctly", async () => {
  const lines = [];
  await parseCsv(fakeCsvPath, (row) => lines.push(row));
  expect(lines).toStrictEqual([
    ["0", "16777215", "-", "-"],
    ["16777216", "16777471", "US", "United States of America"],
    ["16777472", "16778239", "CN", "China"],
    ["16778240", "16779263", "AU", "Australia"],
  ]);
});
