import {
  evaluatePrice,
  evaluateTime,
  evaluateDeadline,
} from "../controllers/evaluationController.js";

const errorMsg = "Unsupported language";
describe("price evaluation", () => {
  const engPrice = 0.12;
  const urkRuPrice = 0.05;
  const engMin = 120;
  const formatMultiplier = 1.2;
  test("regular price without multipliers and above minimum", () => {
    const data = { language: "en", mimetype: "docx", count: 10000 };
    expect(evaluatePrice(data)).toBe(data.count * engPrice);
  });

  test("price with multiplier and above minimum", () => {
    const data = { language: "en", mimetype: "pdf", count: 10000 };
    expect(evaluatePrice(data)).toBe(data.count * engPrice * formatMultiplier);
  });

  test("price with multiplier and below minimum", () => {
    const data = { language: "en", mimetype: "pdf", count: 100 };
    expect(evaluatePrice(data)).toBe(engMin * formatMultiplier);
  });

  test("regular price without multipliers and above minimum in ukr", () => {
    const data = { language: "ukr", mimetype: "docx", count: 10000 };
    expect(evaluatePrice(data)).toBe(data.count * urkRuPrice);
  });

  test("throws exception on unknown language", () => {
    const data = { language: "de", mimetype: "docx", count: 10000 };
    expect(() => evaluatePrice(data)).toThrow(errorMsg);
  });
});

describe("time evaluation", () => {
  const engCharsPerMinute = 333;
  const ukrRuCharsPerMinute = 1333;
  const minTime = 1;
  const additionalTime = 0.5;
  const formatMultiplier = 1.2;
  test("regular time without multipliers and above minimum", () => {
    const data = { language: "en", mimetype: "docx", count: 10000 };
    expect(evaluateTime(data)).toBe(
      additionalTime + data.count / engCharsPerMinute
    );
  });

  test("time with multiplier and above minimum", () => {
    const data = { language: "en", mimetype: "pdf", count: 10000 };
    expect(evaluateTime(data)).toBe(
      (additionalTime + data.count / engCharsPerMinute) * formatMultiplier
    );
  });

  test("time with multiplier and below minimum", () => {
    const data = { language: "en", mimetype: "pdf", count: 100 };
    expect(evaluateTime(data)).toBe(minTime * formatMultiplier);
  });

  test("regular time without multipliers and above minimum in ukr", () => {
    const data = { language: "ukr", mimetype: "docx", count: 10000 };
    expect(evaluateTime(data)).toBe(
      additionalTime + data.count / ukrRuCharsPerMinute
    );
  });

  test("throws exception on unknown language", () => {
    const data = { language: "de", mimetype: "docx", count: 10000 };
    expect(() => evaluateTime(data)).toThrow(errorMsg);
  });
});

import moment from "moment-timezone";
describe("deadline evaluation", () => {
  test("deadline within one day", () => {
    const data = [moment("2022-05-25T13:40:45+03:00"), 3];
    expect(evaluateDeadline(...data).isSame("2022-05-25T16:40:45+03:00")).toBe(
      true
    );
  });

  test("deadline just at the end of the day", () => {
    const data = [moment("2022-05-25T13:45:00+03:00"), 5.25];
    expect(evaluateDeadline(...data).isSame("2022-05-25T19:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline wrapping to the next day", () => {
    const data = [moment("2022-05-25T13:45:00+03:00"), 6];
    expect(evaluateDeadline(...data).isSame("2022-05-26T10:45:00+03:00")).toBe(
      true
    );
  });
  test("deadline wrapping to the next-next day", () => {
    const data = [moment("2022-05-25T13:45:00+03:00"), 15];
    expect(evaluateDeadline(...data).isSame("2022-05-27T10:45:00+03:00")).toBe(
      true
    );
  });
  test("deadline wrapping to the next day (in the morning)", () => {
    const data = [moment("2022-05-25T14:00:00+03:00"), 14];
    expect(evaluateDeadline(...data).isSame("2022-05-26T19:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline starting in the morning", () => {
    const data = [moment("2022-05-25T01:45:00+03:00"), 6];
    expect(evaluateDeadline(...data).isSame("2022-05-25T16:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline starting at night", () => {
    const data = [moment("2022-05-25T23:45:00+03:00"), 6];
    expect(evaluateDeadline(...data).isSame("2022-05-26T16:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline going through weekend and landing on another weekend after compensating for the first one", () => {
    // would stop working on thursday, but after compensating lands on saturday, and then goes to monday
    const data = [moment("2022-05-26T13:00:00+03:00"), 9 * 7];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-06-06T13:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline going through weekend and landing on friday after weekend compensation and then counting in some spare time, which wraps to saturday, which wraps to monday", () => {
    // would stop working on wednesday, but after compensating lands on friday, then wraps to saturday due to additional time, and then wraps to monday due to weekend
    const data = [moment("2022-05-26T16:00:00+03:00"), 9 * 6 + 4];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-06-06T11:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline starting at saturday without week wrapping", () => {
    const data = [moment("2022-05-28T13:00:00+03:00"), 6];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-05-30T16:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline starting at sunday without week wrapping", () => {
    const data = [moment("2022-05-29T13:00:00+03:00"), 6];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-05-30T16:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline finishing at saturday", () => {
    const data = [moment("2022-05-25T13:00:00+03:00"), 27];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-05-30T13:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline finishing at sunday", () => {
    const data = [moment("2022-05-25T13:00:00+03:00"), 36];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-05-31T13:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline with week wrapping", () => {
    const data = [moment("2022-05-25T13:00:00+03:00"), 45];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-06-01T13:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline in 10 work weeks", () => {
    const data = [moment("2022-05-25T13:00:00+03:00"), 450];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-08-03T13:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline in 10 work weeks, starting with saturday", () => {
    const data = [moment("2022-05-21T13:00:00+03:00"), 450];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-08-01T10:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline in 10+ work weeks, ending with saturday", () => {
    const data = [moment("2022-05-25T13:00:00+03:00"), 450 + 27];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-08-08T13:00:00+03:00")).toBe(
      true
    );
  });
  test("deadline in 10+ work weeks, starting with sunday and 'ending' with saturday", () => {
    const data = [moment("2022-05-22T13:00:00+03:00"), 450 + 45 - 18];
    console.log(evaluateDeadline(...data));
    expect(evaluateDeadline(...data).isSame("2022-08-04T10:00:00+03:00")).toBe(
      true
    );
  });
});
