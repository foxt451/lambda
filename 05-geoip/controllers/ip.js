import {
  initIpRegistry,
  ipToInt,
  getRegistryRecordByIp,
  intToIp
} from "../utils/getCountryByIp.js";

const ipRegistryPath = "IP2LOCATION-LITE-DB1.CSV";
const registry = await initIpRegistry(ipRegistryPath);

const getUserCountry = (req, res) => {
  const record = getRegistryRecordByIp(ipToInt(req.ip), registry);
  console.log(req.ip);
  res.json({ ip: req.ip, ...record, start: intToIp(record.start), end: intToIp(record.end) });
};

export { getUserCountry };
