declare function open(row: number, column: number): never | number;

const map = `? ? ? ? ? ?
? ? ? ? ? ?
? ? ? 0 ? ?
? ? ? ? ? ?
? ? ? ? ? ?
0 0 0 ? ? ?`;
const n = 6;

class GameMap {
  private readonly map: number[][];

  constructor(map: string, public n: number) {
    this.map = map
      .split("\n")
      .map((row: string) => row.split(" ").map((cell: string) => Number(cell)));
  }

  updateMap(row: number, column: number, value: number) {
    this.map[row][column] = value;
  }

  public static readonly isUnknown = (num: number) => isNaN(num);
  public static readonly isMine = (num: number) => num === -1;
  static cellToChar(cell: number) {
    if (this.isUnknown(cell))
        return "?";
    if (this.isMine(cell))
        return "x";
    return String(cell);
  }

  isSafePosition(row: number, column: number): boolean {
    return (
      !GameMap.isUnknown(this.map[row][column]) &&
      !GameMap.isMine(this.map[row][column])
    );
  }

  getSurroundingPositions(row: number, column: number): [number, number][] {
    const isBorderBottom: boolean = this.map.length - 1 === row;
    const isBorderTop: boolean = 0 === row;
    const isBorderRight: boolean = this.map[row].length - 1 === column;
    const isBorderLeft: boolean = 0 === column;
    const result: [number, number][] = [];
    if (!isBorderBottom) {
      result.push([row + 1, column]);
      if (!isBorderRight) {
        result.push([row + 1, column + 1]);
      }
      if (!isBorderLeft) {
        result.push([row + 1, column - 1]);
      }
    }
    if (!isBorderRight) {
      result.push([row, column + 1]);
    }
    if (!isBorderLeft) {
      result.push([row, column - 1]);
    }
    if (!isBorderTop) {
      result.push([row - 1, column]);
      if (!isBorderRight) {
        result.push([row - 1, column + 1]);
      }
      if (!isBorderLeft) {
        result.push([row - 1, column - 1]);
      }
    }
    return result;
  }

  // unknown positions bordering with safe
  getBorderPositions(): [number, number][] {
    const borderPositions: [number, number][] = [];
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        console.log(this.map[i][j]);

        if (GameMap.isUnknown(this.map[i][j])) {
          const surrounding = this.getSurroundingPositions(i, j);
          console.log(surrounding);

          if (
            surrounding.some(([row, cell]) => this.isSafePosition(row, cell))
          ) {
            borderPositions.push([i, j]);
          }
        }
      }
    }
    return borderPositions;
  }

  toString(): string {
    return this.map.map((row: number[]) => row.join(" ")).join("\n");
  }
}

const gameMap = new GameMap(map, n);
console.log(gameMap.getBorderPositions());


class GameGuesser {
  constructor(private readonly map: GameMap) {}

  // returns number of mines that have been uncovered without risk of losing
  // solve(): number {

  // }
}
