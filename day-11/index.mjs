import fs from "fs";

const input = fs.readFileSync("./day-11/input.txt", { encoding: "utf-8" }).trim().split("\n");

const steps = 100;

class Matrix {
  _map = [[""]];

  flashes = 0;

  constructor() {
    this._map = this.getMap();
  }

  getMap = () => input.map((row) => row.split("").map(Number));

  turn = () => {
    const exploded = new Set();

    for (let i = 0; i < this._map.length; i++) {
      const line = this._map[i];
      for (let j = 0; j < line.length; j++) {
        this.flash({ i, j, exploded });
      }
    }

    return exploded.size === this._map.length * this._map[0].length;
  };

  flash = ({ i = 0, j = 0, exploded = new Set() }) => {
    if (this._map[i] === undefined) return;
    if (this._map[i][j] === undefined) return;

    const key = i + ":" + j;

    // Check it hasn't exploded yet
    if (exploded.has(key)) {
      return;
    }

    // Increase energy
    this._map[i][j]++;

    const energy = this._map[i][j];

    if (energy > 9) {
      this._map[i][j] = 0;
      exploded.add(key);
      this.flashes++;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) continue;

          this.flash({ i: i + x, j: j + y, exploded });
        }
      }

      return;
    }
  };
}

const part1 = () => {
  const map = new Matrix();

  let firstSync = -1;

  for (let i = 0; i < steps; i++) {
    if (map.turn()) {
      firstSync = i + 1;
    }
  }

  return map.flashes;
};

const part2 = () => {
  const map = new Matrix();

  let turn = 0;

  do {
    turn++;
  } while (!map.turn());

  return turn;
};

const p1 = part1();
const p2 = part2();

console.log("Part 1:", p1, p1 === 1721);
console.log("Part 2:", p2, p2 === 298);
