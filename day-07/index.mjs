import fs from "fs";

const input = fs
  .readFileSync("./day-07/input.txt", { encoding: "utf-8" })
  .split(",")
  .map(Number);

const getMax = () => input.reduce((max, v) => (v > max ? v : max), 0);

const calcCost = (pos = 0, constant = true) => {
  return input.reduce((cost, v) => {
    if (constant) {
      return cost + Math.abs(v - pos);
    } else {
      const steps = Math.abs(v - pos);
      return cost + (steps * (steps + 1)) / 2;
    }
  }, 0);
};

const part1 = (constant = true) => {
  const max = getMax();

  const cheapest = {
    cost: Number.MAX_SAFE_INTEGER,
    pos: -1,
  };

  for (let pos = 0; pos < max; pos++) {
    const cost = calcCost(pos, constant);

    if (cost < cheapest.cost) {
      cheapest.cost = cost;
      cheapest.pos = pos;
    }
  }

  console.log("Cheapest Position:", cheapest.pos);

  return cheapest.cost;
};

const p1 = part1(true);
const p2 = part1(false);

console.log("Part 1:", p1, p1 === 340987);
console.log("Part 2:", p2, p2 === 96987874);
