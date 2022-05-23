import { readFile, writeFile } from "fs/promises";

async function readJson(path) {
  const json = await readFile(path, "utf-8");
  return JSON.parse(json);
}

function writeJson(path, obj) {
  const json = JSON.stringify(obj);
  return writeFile(path, json, "utf-8");
}

function transformData(data) {
  const userVacations = new Map();
  data.forEach((record) => {
    const vacationInfo = {
      startDate: record.startDate,
      endDate: record.endDate,
    };

    const userId = record.user._id;
    if (!userVacations.has(userId)) {
      userVacations.set(userId, {
        userId,
        name: record.user.name,
        weekendDates: [],
      });
    }
    userVacations.get(userId).weekendDates.push(vacationInfo);
  });
  return [...userVacations.values()];
}

export async function transformJson(pathFrom, pathTo) {
  const json = await readJson(pathFrom);
  const transformed = transformData(json);
  return writeJson(pathTo, transformed);
}
