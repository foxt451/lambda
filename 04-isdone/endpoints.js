export const resources = new Map([
  [
    1,
    [
      "https://jsonbase.com/lambdajson_type1/793",
      "https://jsonbase.com/lambdajson_type1/955",
      "https://jsonbase.com/lambdajson_type1/231",
      "https://jsonbase.com/lambdajson_type1/931",
      "https://jsonbase.com/lambdajson_type1/93",
    ],
  ],
  [
    2,
    [
      "https://jsonbase.com/lambdajson_type2/342",
      "https://jsonbase.com/lambdajson_type2/770",
      "https://jsonbase.com/lambdajson_type2/491",
      "https://jsonbase.com/lambdajson_type2/281",
      "https://jsonbase.com/lambdajson_type2/718",
    ],
  ],
  [
    3,
    [
      "https://jsonbase.com/lambdajson_type3/310",
      "https://jsonbase.com/lambdajson_type3/806",
      "https://jsonbase.com/lambdajson_type3/469",
      "https://jsonbase.com/lambdajson_type3/258",
      "https://jsonbase.com/lambdajson_type3/516",
    ],
  ],
  [
    4,
    [
      "https://jsonbase.com/lambdajson_type4/79",
      "https://jsonbase.com/lambdajson_type4/706",
      "https://jsonbase.com/lambdajson_type4/521",
      "https://jsonbase.com/lambdajson_type4/350",
      "https://jsonbase.com/lambdajson_type4/64",
    ],
  ],
]);

export const extractors = new Map([
  [1, (json) => json.isDone],
  [2, (json) => json.location.isDone],
  [3, (json) => json.isDone],
  [4, (json) => json.higherEducation.isDone],
]);
