var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var map = "? ? ? ? ? ?\n? ? ? ? ? ?\n? ? ? 0 ? ?\n? ? ? ? ? ?\n? ? ? ? ? ?\n0 0 0 ? ? ?";
var n = 6;
var GameMap = /** @class */ (function () {
    function GameMap(map, n) {
        this.n = n;
        this.map = map
            .split("\n")
            .map(function (row) { return row.split(" ").map(function (cell) { return Number(cell); }); });
    }
    GameMap.prototype.updateMap = function (row, column, value) {
        if (value === "unknown")
            value = NaN;
        if (value === "mine")
            value = -1;
        this.map[row][column] = value;
    };
    GameMap.cellToChar = function (cell) {
        if (this.isUnknown(cell))
            return "?";
        if (this.isMine(cell))
            return "x";
        return String(cell);
    };
    GameMap.prototype.isSafePosition = function (row, column) {
        return GameMap.isNumber(this.map[row][column]);
    };
    GameMap.prototype.getSurroundingPositions = function (row, column) {
        var isBorderBottom = this.map.length - 1 === row;
        var isBorderTop = 0 === row;
        var isBorderRight = this.map[row].length - 1 === column;
        var isBorderLeft = 0 === column;
        var result = [];
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
    };
    // unknown positions bordering with safe
    GameMap.prototype.getBorderPositions = function () {
        var _this = this;
        var borderPositions = [];
        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[i].length; j++) {
                if (GameMap.isUnknown(this.map[i][j])) {
                    var surrounding = this.getSurroundingPositions(i, j);
                    if (surrounding.some(function (_b) {
                        var row = _b[0], cell = _b[1];
                        return _this.isSafePosition(row, cell);
                    })) {
                        borderPositions.push([i, j]);
                    }
                }
            }
        }
        return borderPositions;
    };
    GameMap.prototype.getNumPositions = function () {
        var numPositions = [];
        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[i].length; j++) {
                if (this.isSafePosition(i, j)) {
                    numPositions.push([i, j]);
                }
            }
        }
        return numPositions;
    };
    GameMap.prototype.isPossibleMine = function (row, column, alreadyExists) {
        if (alreadyExists === void 0) { alreadyExists = false; }
        var surroundings = this.getSurroundingPositions(row, column);
        for (var _i = 0, surroundings_1 = surroundings; _i < surroundings_1.length; _i++) {
            var surrounding = surroundings_1[_i];
            if (!GameMap.isNumber(this.map[surrounding[0]][surrounding[1]])) {
                continue;
            }
            // this is a number
            var numSurroundings = this.getSurroundingPositions.apply(this, surrounding);
            // count number of mines
            var totalMines = 0;
            for (var _b = 0, numSurroundings_1 = numSurroundings; _b < numSurroundings_1.length; _b++) {
                var numSurrounding = numSurroundings_1[_b];
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
    };
    GameMap.prototype.toString = function () {
        return this.map
            .map(function (row) {
            return row.map(function (num) { return GameMap.cellToChar(num); }).join(" ");
        })
            .join("\n");
    };
    GameMap.prototype.getAt = function (row, column) {
        return this.map[row][column];
    };
    var _a;
    _a = GameMap;
    GameMap.isUnknown = function (num) { return isNaN(num); };
    GameMap.isMine = function (num) { return num === -1; };
    GameMap.isNumber = function (num) {
        return !_a.isMine(num) && !_a.isUnknown(num);
    };
    return GameMap;
}());
var GameGuesser = /** @class */ (function () {
    function GameGuesser(map) {
        this.map = map;
    }
    //returns number of mines that have been uncovered without risk of losing
    GameGuesser.prototype.solve = function () {
        while (true) {
            var hadResult1 = this.excludeStrategy();
            var hadResult2 = this.compareStrategy();
            if (!hadResult1 && !hadResult2) {
                break;
            }
        }
        return 1;
    };
    // a simple strategy - try setting a mine in every border position
    // returns when iterations give no results
    GameGuesser.prototype.excludeStrategy = function () {
        var _b, _c;
        var iterNum = 0;
        while (true) {
            var borderPositions = this.map.getBorderPositions();
            var hasResults = false;
            for (var _i = 0, borderPositions_1 = borderPositions; _i < borderPositions_1.length; _i++) {
                var borderPos = borderPositions_1[_i];
                // try setting a mine on this positions and then check if it's impossible (if so set this place as a mine)
                if (!(_b = this.map).isPossibleMine.apply(_b, borderPos)) {
                    hasResults = true;
                    (_c = this.map).updateMap.apply(_c, __spreadArray(__spreadArray([], borderPos, false), [open.apply(void 0, borderPos)], false));
                }
            }
            if (!hasResults) {
                if (iterNum === 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            iterNum++;
        }
    };
    // compares number of free spaces and required mines. if they correspond - set them
    GameGuesser.prototype.compareStrategy = function () {
        var _b, _c, _d, _e, _f;
        var iterNum = 0;
        while (true) {
            var numPositions = this.map.getNumPositions();
            console.log(numPositions);
            var hasResults = false;
            for (var _i = 0, numPositions_1 = numPositions; _i < numPositions_1.length; _i++) {
                var numPos = numPositions_1[_i];
                // count number of mines and free spaces around and compare
                var surroundingPositions = (_b = this.map).getSurroundingPositions.apply(_b, numPos);
                var minesAround = 0;
                var unknownAround = 0;
                var unknownPoses = [];
                for (var _g = 0, surroundingPositions_1 = surroundingPositions; _g < surroundingPositions_1.length; _g++) {
                    var surroundingPosition = surroundingPositions_1[_g];
                    if (GameMap.isMine((_c = this.map).getAt.apply(_c, surroundingPosition))) {
                        minesAround++;
                    }
                    else if (GameMap.isUnknown((_d = this.map).getAt.apply(_d, surroundingPosition))) {
                        unknownAround++;
                        unknownPoses.push(surroundingPosition);
                    }
                }
                if ((_e = this.map).getAt.apply(_e, numPos) - minesAround === unknownAround) {
                    for (var _h = 0, unknownPoses_1 = unknownPoses; _h < unknownPoses_1.length; _h++) {
                        var unknownPos = unknownPoses_1[_h];
                        (_f = this.map).updateMap.apply(_f, __spreadArray(__spreadArray([], unknownPos, false), ["mine"], false));
                        hasResults = true;
                    }
                }
            }
            if (!hasResults) {
                if (iterNum === 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            iterNum++;
        }
    };
    return GameGuesser;
}());
function solveMine(map, n) {
    var gameMap = new GameMap(map, n);
    var guessr = new GameGuesser(gameMap);
    guessr.solve();
    return gameMap.toString();
}
