function dots(str) {
  if (str.length <= 1) {
    return [str];
  }
  return dots(str.slice(0, -1))
    .map((dotted) => [dotted + "." + str.at(-1), dotted + str.at(-1)])
    .flat();
}

export default dots;
