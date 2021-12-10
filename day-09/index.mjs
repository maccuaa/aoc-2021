import fs from "fs";

const input = fs.readFileSync("./day-09/input.txt", { encoding: "utf-8" }).trim().split("\n");

const part1 = () => {
  // convert the input from a 2-dimensional input to 1-dimension
  const rowLength = input[0].length;

  // join the arrays then split the map into individual heights
  const heightMap = input.join("").split("").map(Number);

  const lowPoints = heightMap.filter((height, i) => {
    // check left
    if (i % rowLength > 0 && height >= heightMap[i - 1]) {
      return false;
    }

    // check right
    if (i % rowLength < rowLength - 1 && height >= heightMap[i + 1]) {
      return false;
    }

    // check up
    if (i > rowLength - 1 && height >= heightMap[i - rowLength]) {
      return false;
    }

    // check down
    if (i < heightMap.length - rowLength && height >= heightMap[i + rowLength]) {
      return false;
    }

    return true;
  });

  // calculate risk level
  // The risk level of a low point is 1 plus its height.
  // Calculate the sum of the risk levels of all low points on your heightmap

  return lowPoints.reduce((s, h) => s + h + 1, 0);
};

const part2 = () => {
  // convert the input from a 2-dimensional input to 1-dimension
  const rowLength = input[0].length;

  // join the arrays then split the map into individual heights
  const heightMap = input.join("").split("").map(Number);

  // recursively find the basin size
  const getBasinSize = (i = 0) => {
    // get the height of the current position
    const height = heightMap[i];

    // clear the current position from the map so it doesn't get double counted
    heightMap[i] = null;

    if (height === 9 || height === null) {
      return 0;
    }

    // The size of a basin is the number of locations within the basin, including the low point
    let sum = 1;

    // check left
    if (i % rowLength > 0) {
      sum += getBasinSize(i - 1);
    }

    // check right
    if (i % rowLength < rowLength - 1) {
      sum += getBasinSize(i + 1);
    }

    // check up
    if (i > rowLength - 1) {
      sum += getBasinSize(i - rowLength);
    }

    // check down
    if (i < heightMap.length - rowLength) {
      sum += getBasinSize(i + rowLength);
    }

    return sum;
  };

  const basins = [];

  for (let i = 0; i < heightMap.length; i++) {
    if (heightMap[i] !== null) {
      const size = getBasinSize(i);

      if (size > 0) {
        basins.push(size);
      }
    }
  }

  // Find the three largest basins and multiply their sizes together.
  const [first, second, third] = basins.sort((a, b) => b - a);

  return first * second * third;
};

const p1 = part1();
const p2 = part2();

console.log("Part 1:", p1, p1 === 465);
console.log("Part 2:", p2, p2 === 1269555);
