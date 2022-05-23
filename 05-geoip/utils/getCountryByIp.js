import { parseCsv } from "./csvParser.js";

function getRegistryRecordByIp(ip, registry) {
  // binary search
  let start = 0;
  let end = registry.length;
  let m;
  while (start <= end) {
    m = Math.floor((start + end) / 2);
    const record = registry[m];
    if (ip >= record.start && ip <= record.end) {
      return record;
    } else if (ip >= record.start) {
      start = m + 1;
    } else {
      end = m - 1;
    }
  }
}

async function initIpRegistry(path) {
  const registry = [];
  await parseCsv(path, (row) => updateIpRegistryWithRow(registry, row));
  registry.sort((a, b) => a.start - b.start);
  return registry;
}

function updateIpRegistryWithRow(registry, row) {
  const registryObj = {
    start: Number(row[0]),
    end: Number(row[1]),
    countryCode: row[2],
    country: row[3],
  };
  registry.push(registryObj);
}

function ipToInt(ip) {
  return ip
    .split(".")
    .reduce(
      (accumulator, current, ind, arr) =>
        accumulator + Number(current) * 256 ** (arr.length - (ind + 1)),
      0
    );
}

function intToIp(int) {
  const convertedParts = [];
  while (int !== 0) {
    const part = int % 256;
    convertedParts.unshift(part);
    int = Math.floor(int / 256);
  }
  return convertedParts.join(".");
}

export { initIpRegistry, getRegistryRecordByIp, ipToInt, intToIp };
