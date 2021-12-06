import fs from "fs";

const input = fs.readFileSync("./day-01/input.txt", { encoding: "utf-8" });

const rows = input.split("\n").map((t) => +t);

const part1 = () => {
  let count = 0;

  for (let i = 1; i < rows.length; i++) {
    const current = rows[i];
    const previous = rows[i - 1];

    if (current > previous) {
      count = count + 1;
    }
  }

  return count;
};

const part2 = () => {
  let count = 0;

  /* 
        Array of three-measurement windows 
        [
            [1, 2, 3],
            [2, 3, 4],
            ...
        ]
    */
  const windows = [];

  for (let i = 0; i < rows.length - 2; i++) {
    windows.push([rows[i], rows[i + 1], rows[i + 2]]);
  }

  const sum = (arr) => Array.from(arr).reduce((sum, curr) => (sum += curr), 0);

  for (let i = 1; i < windows.length; i++) {
    const current = sum(windows[i]);
    const previous = sum(windows[i - 1]);

    if (current > previous) {
      count = count + 1;
    }
  }

  return count;
};

console.log("Part 1:", part1()); // 1548
console.log("Part 2:", part2()); // 1548
