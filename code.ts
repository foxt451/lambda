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

  updateMap(row: number, column: number, value: number | "unknown" | "mine") {
    if (value === "unknown") value = NaN;
    if (value === "mine") value = -1;
    this.map[row][column] = value;
  }

  public static readonly isUnknown = (num: number) => isNaN(num);
  public static readonly isMine = (num: number) => num === -1;
  public static readonly isNumber = (num: number) =>
    !this.isMine(num) && !this.isUnknown(num);
  static cellToChar(cell: number) {
    if (this.isUnknown(cell)) return "?";
    if (this.isMine(cell)) return "x";
    return String(cell);
  }

  isSafePosition(row: number, column: number): boolean {
    return GameMap.isNumber(this.map[row][column]);
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
        if (GameMap.isUnknown(this.map[i][j])) {
          const surrounding = this.getSurroundingPositions(i, j);

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

  getNumPositions(): [number, number][] {
    const numPositions: [number, number][] = [];
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.isSafePosition(i, j)) {
          numPositions.push([i, j]);
        }
      }
    }
    return numPositions;
  }

  isPossibleMine(
    row: number,
    column: number,
    alreadyExists: boolean = false
  ): boolean {
    const surroundings = this.getSurroundingPositions(row, column);
    for (const surrounding of surroundings) {
      if (!GameMap.isNumber(this.map[surrounding[0]][surrounding[1]])) {
        continue;
      }
      // this is a number
      const numSurroundings = this.getSurroundingPositions(...surrounding);
      // count number of mines
      let totalMines = 0;
      for (const numSurrounding of numSurroundings) {
        if (GameMap.isMine(this.map[numSurrounding[0]][numSurrounding[1]])) {
          totalMines++;
        }
      }
      if (!alreadyExists) {
        totalMines++;
      }
      if (totalMines > this.map[surrounding[0]][surrounding[1]]) {
        return false;
      }
    }
    return true;
  }

  toString(): string {
    return this.map
      .map((row: number[]) =>
        row.map((num) => GameMap.cellToChar(num)).join(" ")
      )
      .join("\n");
  }

  getAt(row: number, column: number) {
    return this.map[row][column];
  }
}

class GameGuesser {
  constructor(private readonly map: GameMap) {}

  //returns number of mines that have been uncovered without risk of losing
  solve(): number {
    while (true) {
      const hadResult1: boolean = this.excludeStrategy();
      const hadResult2: boolean = this.compareStrategy();
      if (!hadResult1 && !hadResult2) {
        break;
      }
    }
    return 1;
  }

  // a simple strategy - try setting a mine in every border position
  // returns when iterations give no results
  excludeStrategy(): boolean {
    let iterNum = 0;
    while (true) {
      const borderPositions: [number, number][] = this.map.getBorderPositions();
      let hasResults: boolean = false;
      for (const borderPos of borderPositions) {
        // try setting a mine on this positions and then check if it's impossible (if so set this place as a mine)
        if (!this.map.isPossibleMine(...borderPos)) {
          hasResults = true;
          this.map.updateMap(...borderPos, open(...borderPos));
        }
      }
      if (!hasResults) {
        if (iterNum === 0) {
          return false;
        } else {
          return true;
        }
      }
      iterNum++;
    }
  }

  // compares number of free spaces and required mines. if they correspond - set them
  compareStrategy(): boolean {
    let iterNum = 0;
    while (true) {
      const numPositions: [number, number][] = this.map.getNumPositions();
      console.log(numPositions)
      let hasResults: boolean = false;
      for (const numPos of numPositions) {
        // count number of mines and free spaces around and compare
        const surroundingPositions = this.map.getSurroundingPositions(
          ...numPos
        );
        let minesAround = 0;
        let unknownAround = 0;
        const unknownPoses: [number, number][] = [];
        for (const surroundingPosition of surroundingPositions) {
          if (GameMap.isMine(this.map.getAt(...surroundingPosition))) {
            minesAround++;
          } else if (
            GameMap.isUnknown(this.map.getAt(...surroundingPosition))
          ) {
            unknownAround++;
            unknownPoses.push(surroundingPosition);
          }
        }
        if (this.map.getAt(...numPos) - minesAround === unknownAround) {
          for (const unknownPos of unknownPoses) {
            this.map.updateMap(...unknownPos, "mine");
            hasResults = true;
          }
        }
      }
      if (!hasResults) {
        if (iterNum === 0) {
          return false;
        } else {
          return true;
        }
      }
      iterNum++;
    }
  }
}

function solveMine(map: string, n: number): string {
  const gameMap = new GameMap(map, n);
  const guessr = new GameGuesser(gameMap);
  guessr.solve();
  return gameMap.toString();
}
