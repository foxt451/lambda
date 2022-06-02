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
        return (!GameMap.isUnknown(this.map[row][column]) &&
            !GameMap.isMine(this.map[row][column]));
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
                console.log(this.map[i][j]);
                if (GameMap.isUnknown(this.map[i][j])) {
                    var surrounding = this.getSurroundingPositions(i, j);
                    console.log(surrounding);
                    if (surrounding.some(function (_a) {
                        var row = _a[0], cell = _a[1];
                        return _this.isSafePosition(row, cell);
                    })) {
                        borderPositions.push([i, j]);
                    }
                }
            }
        }
        return borderPositions;
    };
    GameMap.prototype.toString = function () {
        return this.map.map(function (row) { return row.join(" "); }).join("\n");
    };
    GameMap.isUnknown = function (num) { return isNaN(num); };
    GameMap.isMine = function (num) { return num === -1; };
    return GameMap;
}());
var gameMap = new GameMap(map, n);
console.log(gameMap.getBorderPositions());
var GameGuesser = /** @class */ (function () {
    function GameGuesser(map) {
        this.map = map;
    }
    return GameGuesser;
}());
