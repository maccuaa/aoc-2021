import fs from "fs";

const input = fs.readFileSync("./day-02/input.txt", { encoding: "utf-8" });

const rows = input.split("\n").map((r) => r.trim());

const part1 = () => {
  let horizontal = 0;
  let depth = 0;

  for (let row of rows) {
    const [d, v] = row.split(" ");

    const direction = d.trim();
    const value = Number(v);

    if (!d || !v) {
      continue;
    }

    switch (direction) {
      case "forward":
        horizontal += value;
        break;
      case "down":
        depth += value;
        break;
      case "up":
        depth -= value;
        break;
      default:
        console.log("Unknown direction", direction);
    }
  }

  return horizontal * depth;
};

const part2 = () => {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  for (let row of rows) {
    const [d, v] = row.split(" ");

    const direction = d.trim();
    const value = Number(v);

    if (!d || !v) {
      continue;
    }

    switch (direction) {
      case "forward":
        horizontal += value;
        depth += aim * value;
        break;
      case "down":
        aim += value;
        break;
      case "up":
        aim -= value;
        break;
      default:
        console.log("Unknown direction", direction);
    }
  }

  return horizontal * depth;
};

console.log("Part 1:", part1());
console.log("Part 2:", part2());
