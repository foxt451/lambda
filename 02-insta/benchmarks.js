const benchmarkAsync = async (name, func) => {
  const t0 = performance.now();
  const result = await func();
  const t1 = performance.now();
  const delta = t1 - t0;
  console.log(`${name}: ${delta} ms`);
  return [delta, result];
};

export { benchmarkAsync };
