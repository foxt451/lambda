import {
  initIpRegistry,
  getRegistryRecordByIp,
  ipToInt,
  intToIp
} from "../utils/getCountryByIp.js";

const fakeUnorderedCsvPath = "tests/fakeUnorderedCsv.csv";

test("initializes correctly", async () => {
  const registry = await initIpRegistry(fakeUnorderedCsvPath);
  expect(registry).toStrictEqual([
    { start: 0, end: 16777215, countryCode: "-", country: "-" },
    { start: 16777472, end: 16778239, countryCode: "CN", country: "China" },
    { start: 16778240, end: 16779263, countryCode: "AU", country: "Australia" },
  ]);
});

const trueCsvPath = "IP2LOCATION-LITE-DB1.CSV";
describe("determines country by ip", () => {
  let registry;
  beforeAll(async () => {
    registry = await initIpRegistry(trueCsvPath);
  });

  test("recognizes Ukraine", () => {
    expect(getRegistryRecordByIp(2955157604, registry).country).toStrictEqual(
      "Ukraine"
    );
  });
  test("recognizes Chile", () => {
    const record = getRegistryRecordByIp(770232463, registry);
    expect(record.country).toStrictEqual("Chile");
  });
  test("recognizes Armenia", () => {
    const record = getRegistryRecordByIp(3115743266, registry);
    expect(record.country).toStrictEqual("Armenia");
  });
  test("recognizes GB", () => {
    const record = getRegistryRecordByIp(388699919, registry);
    expect(record.countryCode).toStrictEqual("GB");
  });
});

test("converts ip to int", async () => {
  expect(ipToInt("45.232.208.143")).toStrictEqual(770232463);
  expect(ipToInt("91.149.48.22")).toStrictEqual(1536503830);
  expect(ipToInt("176.36.32.100")).toStrictEqual(2955157604);
});

test("converts int to ip", async () => {
  expect(intToIp(770232463)).toStrictEqual("45.232.208.143");
  expect(intToIp(1536503830)).toStrictEqual("91.149.48.22");
  expect(intToIp(2955157604)).toStrictEqual("176.36.32.100");
});
