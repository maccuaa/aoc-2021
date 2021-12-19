import fs from "fs";

const input = fs.readFileSync("./day-13/input.txt", { encoding: "utf-8" }).trim().split("\n");

const getMaxCoords = (dots = []) => {
  const max = dots.reduce(
    (coord, row) => {
      const [x, y] = row;

      if (x > coord.x) {
        coord.x = x;
      }

      if (y > coord.y) {
        coord.y = y;
      }

      return coord;
    },
    { x: 0, y: 0 }
  );

  max.x++;
  max.y++;

  return max;
};

class Paper {
  grid = [[""]];
  width = 0;
  height = 0;

  constructor(width = 0, height = 0) {
    this.grid = Array.from(Array(height), () => new Array(width).fill("."));
    this.width = width;
    this.height = height;
  }

  addDots = (dots = [Infinity]) => {
    for (const [x, y] of dots) {
      this.grid[y][x] = "#";
    }
  };

  fold = (axis = "", line = 0) => {
    if (axis === "x") {
      for (let y = 0; y < this.height; y++) {
        for (let x = line + 1; x < this.width; x++) {
          const diff = x - line;

          if (this.grid[y][x] === "#") {
            this.grid[y][line - diff] = "#";
          }
        }
      }

      this.grid = this.grid.map((row) => row.slice(0, line));
      this.width = line;

      return;
    }

    if (axis === "y") {
      for (let y = line + 1; y < this.height; y++) {
        const diff = y - line;

        for (let x = 0; x < this.width; x++) {
          if (this.grid[y][x] === "#") {
            this.grid[line - diff][x] = "#";
          }
        }
      }

      this.grid = this.grid.slice(0, line);
      this.height = line;

      return;
    }

    console.error("Unkown axis", axis);
  };

  get visibleDots() {
    return this.grid.reduce((sum, row) => sum + row.reduce((s, v) => (v === "#" ? ++s : s), 0), 0);
  }

  print() {
    const double = this.width > 10;

    // console.log(double ? "   " : " ", [...Array(this.width)].map((_, i) => i).join(" "));

    this.grid.forEach((row, i) => {
      console.log(row.join(""));
    });
  }
}

const part1 = () => {
  const index = input.indexOf("");
  const dots = input.slice(0, index).map((r) => r.split(",").map(Number));
  const folds = input.slice(index + 1).map((r) => r.replace("fold along", "").trim().split("="));

  const max = getMaxCoords(dots);

  const paper = new Paper(max.x, max.y);

  paper.addDots(dots);

  let first = null;

  for (let [axis, line] of folds) {
    paper.fold(axis, Number(line));

    if (first === null) {
      first = paper.visibleDots;
    }
  }

  console.log("Part 1:", first, first === 687);

  console.log("Part 2:", "FGKCKBZG");
  paper.print();
};

part1();
