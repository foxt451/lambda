import dots from "./dots.js";

test("one-character string - returns just this string", () => {
  expect(dots("a")).toStrictEqual(["a"]);
});

test("ab -> ab, a.b", () => {
  expect(new Set(dots("ab"))).toStrictEqual(new Set(["ab", "a.b"]));
});

test("abc -> abc, a.bc, ab.c, a.b.c", () => {
  expect(new Set(dots("abc"))).toStrictEqual(
    new Set(["abc", "a.bc", "ab.c", "a.b.c"])
  );
});

test("abcd -> abcd, a.bcd, ab.cd, abc.d, a.b.cd, a.bc.d, ab.c.d, a.b.c.d", () => {
  expect(new Set(dots("abcd"))).toStrictEqual(
    new Set([
      "abcd",
      "a.bcd",
      "ab.cd",
      "abc.d",
      "a.b.cd",
      "a.bc.d",
      "ab.c.d",
      "a.b.c.d",
    ])
  );
});

test("number of options for arbitratily large strings equals 2 ^ (len - 1) and all options are different", () => {
  const lengths = [
    1, 2, 3, 4, 10, 15, 20, 24,
  ];
  lengths.forEach((length) => {
    const str = "a".repeat(length);
    const dotArr = dots(str);
    console.log(dotArr.length);
    // array items are unique
    expect(new Set(dotArr).size).toStrictEqual(dotArr.length);

    expect(dotArr.length).toStrictEqual(2 ** (length - 1));
  });
});
