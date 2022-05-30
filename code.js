class List {
  constructor(iterator) {
    this[Symbol.iterator] = iterator;
  }
  static get empty() {
    return new List(function* () {
      return;
    });
  }

  static iterate(fn, x) {
    //console.log("#iterate " + fn.toString());
    return new List(function* () {
      while (true) {
        yield x;
        x = fn(x);
      }
    });
  }

  static repeat(x) {
    //console.log("#repeat");
    return new List(function* () {
      while (true) {
        yield x;
      }
    });
  }

  static cycle(xs) {
    //console.log("#cycle");
    return new List(function* () {
      while (true) {
        for (const x of xs) yield x;
      }
    });
  }

  static replicate(n, x) {
    //console.log("#replicate");
    return new List(function* () {
      for (let i = 0; i < n; i++) {
        yield x;
      }
    });
  }

  static fromList(xs) {
    //console.log("#from list " + xs);
    return new List(function* () {
      for (const x of xs) yield x;
    });
  }

  static get PRIME() {
    const isPrime = (num) => {
      for (let i = 2, s = Math.sqrt(num); i <= s; i++)
        if (num % i === 0) return false;
      return num > 1;
    };
    let cur = 3;
    return new List(function* () {
      yield 2;
      while (true) {
        if (isPrime(cur)) yield cur;
        cur += 2;
      }
    });
  }

  static get FIB() {
    let a = 0;
    let b = 1;
    return new List(function* () {
      while (true) {
        yield a;
        [a, b] = [b, a + b];
      }
    });
  }

  static get PI() {
    return new List(function* () {
      let cur = 0;
      let i = 1;
      while (true) {
        yield 4 * cur;
        cur += ((-1) ** Math.floor(i / 2) * (1 / 2) ** i) / i;
        cur += ((-1) ** Math.floor(i / 2) * (1 / 3) ** i) / i;
        i += 2;
      }
    });
  }

  head() {
    //console.log("#head");
    return this[Symbol.iterator]().next().value;
  }

  tail() {
    //console.log("#tail");
    return new List(
      function* () {
        const it = this[Symbol.iterator]();
        it.next();
        let n = it.next();
        while (!n.done) {
          yield n.value;
          n = it.next();
        }
        //console.log("#tailed");
      }.bind(this)
    );
  }

  init() {
    //console.log("#init");
    return new List(
      function* () {
        const it = this[Symbol.iterator]();
        let n1 = it.next();
        let n2 = it.next();
        while (!n2.done) {
          yield n1.value;
          n1 = n2;
          n2 = it.next();
        }
      }.bind(this)
    );
  }

  last() {
    const it = this[Symbol.iterator]();
    let n1 = it.next();
    let n2 = it.next();
    while (!n2.done) {
      n1 = n2;
      n2 = it.next();
    }
    return n1.value;
  }

  length() {
    let i = 0;
    for (const x of this) {
      i++;
    }
    return i;
  }

  toList() {
    const list = [...this];
    //console.log(this[Symbol.iterator].toString())
    //console.log("#to list " + list);
    return list;
  }

  get(ind) {
    let i = 0;
    for (const x of this) {
      if (ind === i) {
        return x;
      }
      i++;
    }
  }

  nil() {
    const it = this[Symbol.iterator]();
    if (it.next().done) {
      return true;
    }
    return false;
  }

  take(n) {
    //console.log("#taking " + n);

    return new List(
      function* () {
        let i = 0;
        for (const x of this) {
          i++;
          if (n < i) {
            return;
          }
          yield x;
        }
      }.bind(this)
    );
  }

  drop(n) {
    //console.log("#dropping " + n);
    return new List(
      function* () {
        let i = 0;
        for (const x of this) {
          i++;
          if (i <= n) continue;
          else yield x;
        }
      }.bind(this)
    );
  }

  cons(x) {
    //console.log("#cons");

    return new List(
      function* () {
        yield x;
        for (const n of this) yield n;
      }.bind(this)
    );
  }

  append(xs) {
    //console.log("#append");

    return new List(
      function* () {
        for (const n of this) yield n;
        for (const n of xs) yield n;
      }.bind(this)
    );
  }

  slice(i = 0, j = Infinity) {
    //console.log("#slice");

    return this.drop(i).take(j - i);
  }

  map(fn) {
    //console.log("#map");
    return new List(
      function* () {
        for (const n of this) yield fn(n);
      }.bind(this)
    );
  }

  filter(fn) {
    //console.log("#filter");

    return new List(
      function* () {
        for (const n of this) {
          if (fn(n)) yield n;
        }
      }.bind(this)
    );
  }

  reverse() {
    //console.log("#reverse");
    const arr = this.toList();
    arr.reverse();
    return List.fromList(arr);
  }

  concat() {
    //console.log("#concat");
    return new List(
      function* () {
        for (const sublist of this) {
          for (const el of sublist) {
            yield el;
          }
        }
      }.bind(this)
    );
  }

  concatMap(fn) {
    //console.log("#concat map");
    return new List(
      function* () {
        for (const sublist of this) {
          const generated = fn(sublist);
          for (const el of generated) {
            yield el;
          }
        }
      }.bind(this)
    );
  }

  zipWith(fn, xs) {
    //console.log("#zip");
    return new List(
      function* () {
        const l2iter = xs[Symbol.iterator]();
        for (const n of this) yield fn(n, l2iter.next().value);
      }.bind(this)
    );
  }

  foldr(fn, x) {
    //console.log("#foldr");
    if (fn.length === 0) {
      return x;
    }
    //console.log(this.length());
    if (this.length() <= 1) {
      try {
        return fn(this.head(), x);
      } catch (err) {
        return x;
      }
    }
    const first = this.head();
    const next = this.drop(1);
    return fn(first, next.foldr(fn, x));
  }

  foldl(fn, x) {
    //console.log("#foldl");
    const arr = this.toList();
    return arr.reduce((prev, cur) => fn(prev, cur), x);
  }

  scanl(fn, x) {
    //console.log("#scanl");
    return new List(
      function* () {
        let prev = x;
        for (const n of this) {
          yield prev;
          prev = fn(prev, n);
        }
        yield prev;
      }.bind(this)
    );
  }

  scanr(fn, x) {
    //console.log("#scanr");
    if (this.length() === 0) return List.fromList([x]);
    const next = this.drop(1).scanr(fn, x);
    return List.fromList([fn(this.head(), next.head())]).append(next);
  }

  elem(x) {
    for (const el of this) {
      if (el === x) {
        return true;
      }
    }
    return false;
  }

  elemIndex(x) {
    let i = 0;
    for (const el of this) {
      if (el === x) {
        return i;
      }
      i++;
    }
    return -1;
  }

  find(fn) {
    for (const el of this) {
      if (fn(el)) {
        return el;
      }
    }
  }

  findIndex(fn) {
    let i = 0;
    for (const el of this) {
      if (fn(el)) {
        return i;
      }
      i++;
    }
    return -1;
  }

  any(fn) {
    for (const el of this) {
      if (fn(el)) {
        return true;
      }
    }
    return false;
  }

  all(fn) {
    for (const el of this) {
      if (!fn(el)) {
        return false;
      }
    }
    return true;
  }

  the() {
    let prev = this.head();
    for (const n of this) {
      if (n !== prev) {
        return undefined;
      }
      prev = n;
    }
    return prev;
  }
}

const plus = (v, w) => v + w,
  times = (v, w) => v * w,
  inc = (x) => x + 1,
  id = (x) => x,
  constant = id;
const l0 = List.iterate(inc, 0);
const l2 = l0.take(10);
console.log(List.iterate(inc, 0).take(10).zipWith(times, List.fromList([0,1,2,3,4,5,6,7,8,9])).toList());
