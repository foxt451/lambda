function* dotGen(char, phase) {
  while (true) {
    for (let i = 0; i < phase; i++) {
      yield char;
    }
    for (let i = 0; i < phase; i++) {
      yield char + ".";
    }
  }
}

function* dryRun(char) {
  while (true) yield char;
}

function* dots(str) {
  const gens = [...str].map((char, ind, arr) => {
    if (ind === arr.length - 1) {
      return dryRun(char);
    }
    return dotGen(char, 2 ** ind);
  });
  let counter = 0;
  const limit = 2 ** (str.length - 1);
  while (counter++ < limit) {
    yield gens.map((gen) => gen.next().value).join("");
  }
}

export default dots;
