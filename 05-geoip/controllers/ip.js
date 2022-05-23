import {
  initIpRegistry,
  ipToInt,
  getRegistryRecordByIp,
  intToIp
} from "../utils/getCountryByIp.js";

import {isIPv6} from "net";

const ipRegistryPath = "IP2LOCATION-LITE-DB1.CSV";
const registry = await initIpRegistry(ipRegistryPath);

const getUserCountry = (req, res) => {
  const record = getRegistryRecordByIp(ipToInt(req.ip), registry);
  if (isIPv6(req.ip)) {
    return res.json({msg: "IPv6 is not supported"});
  }
  res.json({ ip: req.ip, ...record, start: intToIp(record.start), end: intToIp(record.end) });
};

export { getUserCountry };
