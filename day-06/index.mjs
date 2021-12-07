import fs from "fs";

const input = fs
  .readFileSync("./day-06/input.txt", { encoding: "utf-8" })
  .split(",")
  .map(Number);

const getFishMap = (startingFish = []) => {
  const fish = new Map();

  for (let i = 0; i < 9; i++) {
    fish.set(i, 0);
  }

  startingFish.forEach((f) => {
    fish.set(f, fish.get(f) + 1);
  });

  return fish;
};

const calcFish = (days = 0) => {
  const fishMap = getFishMap(input);

  for (let i = 0; i < days; i++) {
    let temp = 0;

    // Iterate over all the days
    for (const [key, value] of fishMap) {
      if (key === 0) {
        temp = value;
      } else {
        fishMap.set(key - 1, value);
      }
    }

    fishMap.set(8, temp);
    fishMap.set(6, fishMap.get(6) + temp);
  }

  let sum = 0;

  for (const value of fishMap.values()) {
    sum += value;
  }

  return sum;
};

const p1 = calcFish(80);
const p2 = calcFish(256);

console.log("Part 1:", p1, p1 === 375482);
console.log("Part 2:", p2, p2 === 1689540415957);
