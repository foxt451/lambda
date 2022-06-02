const ops = {
  "1": {
    desc: "alphabetic word sort",
    fn: (arr: (number | string)[]): (number | string)[] => {
      const strArr: string[] = arr.filter(
        (el): el is string => typeof el === "string"
      );
      const newArr: (number | string)[] = strArr.sort();
      arr.forEach((value, ind) => {
        if (typeof value === "number") {
          newArr.splice(ind, 0, value);
        }
      });
      return newArr;
    },
  },
  "2": {
    desc: "number ascending sort",
    fn: (arr: (number | string)[]): (number | string)[] => {
      const numArr: number[] = arr.filter(
        (el): el is number => typeof el === "number"
      );
      const newArr: (number | string)[] = numArr.sort((a, b) => a - b);
      arr.forEach((value, ind) => {
        if (typeof value === "string") {
          newArr.splice(ind, 0, value);
        }
      });
      return newArr;
    },
  },
  "3": {
    desc: "number descending sort",
    fn: (arr: (number | string)[]): (number | string)[] => {
      const numArr: number[] = arr.filter(
        (el): el is number => typeof el === "number"
      );
      const newArr: (number | string)[] = numArr.sort((a, b) => b - a);
      arr.forEach((value, ind) => {
        if (typeof value === "string") {
          newArr.splice(ind, 0, value);
        }
      });
      return newArr;
    },
  },
  "4": {
    desc: "lengthwise word sort",
    fn: (arr: (number | string)[]): (number | string)[] => {
      const strArr: string[] = arr.filter(
        (el): el is string => typeof el === "string"
      );
      const newArr: (number | string)[] = strArr.sort(
        (a, b) => a.length - b.length
      );
      arr.forEach((value, ind) => {
        if (typeof value === "number") {
          newArr.splice(ind, 0, value);
        }
      });
      return newArr;
    },
  },
  "5": {
    desc: "remove duplicate words",
    fn: (arr: (number | string)[]): (number | string)[] => {
      const existingWords = new Set<string>();
      return arr.filter((el) => {
        if (typeof el !== "string") return true;
        if (existingWords.has(el)) {
          return false;
        }
        existingWords.add(el);
        return true;
      });
    },
  },
  "6": {
    desc: "remove all duplicates",
    fn: (arr: (number | string)[]): (number | string)[] => {
      return [...new Set(arr)];
    },
  },
  exit: {
    desc: "quit program",
    fn: (): never => {
      process.exit();
    },
  },
};

export default ops;
