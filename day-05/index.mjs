import fs from "fs";

const input = fs.readFileSync("./day-05/input.txt", { encoding: "utf-8" });

const rows = input
  .trim()
  .split("\n")
  .map((t) => t.trim());

console.log("Rows", rows.length);

const getCoords = (row) => {
  const [start, end] = row.split("->").map((x) => x.trim());
  const [x1, y1] = start.split(",").map((x) => x.trim());
  const [x2, y2] = end.split(",").map((x) => x.trim());
  return [x1, y1, x2, y2].map(Number);
};

const getMaxCoords = () => {
  const max = rows.reduce(
    (coord, row) => {
      const [x1, y1, x2, y2] = getCoords(row);

      if (x1 > coord.x || x2 > coord.x) {
        coord.x = Math.max(x1, x2);
      }

      if (y1 > coord.y || y2 > coord.y) {
        coord.y = Math.max(y1, y2);
      }

      return coord;
    },
    { x: 0, y: 0 }
  );

  max.x++;
  max.y++;

  return max;
};

class Map {
  map = [];
  includeDiagonal = false;

  constructor(width = 0, height = 0, includeDiagonal = false) {
    this.map = Array.from(Array(height), () => new Array(width).fill(0));
    this.includeDiagonal = includeDiagonal;
  }

  path(x1, y1, x2, y2) {
    // horizontal path
    if (x1 === x2) {
      const min = Math.min(y1, y2);
      const max = Math.max(y1, y2);

      for (let y = min; y <= max; y++) {
        this.map[y][x1] += 1;
      }
    }

    // vertical path
    else if (y1 === y2) {
      const min = Math.min(x1, x2);
      const max = Math.max(x1, x2);

      for (let x = min; x <= max; x++) {
        this.map[y1][x] += 1;
      }
    }

    // diagonal path
    else if (this.includeDiagonal) {
      const dx = x2 - x1;
      const dy = y2 - y1;

      const xIncrement = Math.sign(dx);
      const yIncrement = Math.sign(dy);

      for (let i = 0; i <= Math.abs(dx); i++) {
        const x = x1 + i * xIncrement;
        const y = y1 + i * yIncrement;

        this.map[y][x] += 1;
      }
    }
  }

  get dangerousPaths() {
    return this.map.flat().filter((x) => x > 1).length;
  }

  print() {
    console.log(" ", [...Array(10)].map((_, i) => i).join(" "));

    this.map.forEach((row, i) => {
      console.log(i, row.map((x) => (x === 0 ? "." : x)).join(" "));
    });
  }
}

const part1 = (includeDiagonal = false) => {
  const max = getMaxCoords();

  const map = new Map(max.x, max.y, includeDiagonal);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const [x1, y1, x2, y2] = getCoords(row);

    map.path(x1, y1, x2, y2);
  }

  // map.print();

  return map.dangerousPaths;
};

console.log("Part 1:", part1(false));
console.log("Part 2:", part1(true)); // 22335
