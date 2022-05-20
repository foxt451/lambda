import { readFile } from "fs/promises";
import { join } from "path";

export async function countUnique(rootDir, fileList) {
  const fileContents = await Promise.all(
    fileList.map(async (fileName) =>
      (await readFile(join(rootDir, fileName), "utf-8")).split("\n")
    )
  );
  const uniqueNames = new Set(fileContents);
  fileContents.forEach((file) => {
    file.forEach((name) => {
      uniqueNames.add(name);
    });
  });
  return uniqueNames.size;
}

export async function countIn20(rootDir, fileList) {
  const uniqueFileContents = await Promise.all(
    fileList.map(
      async (fileName) =>
        new Set((await readFile(join(rootDir, fileName), "utf-8")).split("\n"))
    )
  );
  const totalIntersection = uniqueFileContents.reduce((set1, set2) => {
    return new Set([...set1].filter((el) => set2.has(el)));
  });
  return totalIntersection.size;
}

export async function countInX(rootDir, fileList, x = 10) {
  const uniqueFileContents = await Promise.all(
    fileList.map(
      async (fileName) =>
        new Set((await readFile(join(rootDir, fileName), "utf-8")).split("\n"))
    )
  );
  const nameCounts = new Map();
  const namesInX = [];
  uniqueFileContents.forEach((file) => {
    file.forEach((name) => {
      const curCount = nameCounts.get(name) ?? 0;
      if (curCount === x - 1) {
        namesInX.push(name);
      }
      nameCounts.set(name, curCount + 1);
    });
  });
  return namesInX.length;
}
