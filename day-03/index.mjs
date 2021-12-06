import fs from "fs";

const input = fs.readFileSync("./day-03/input.txt", { encoding: "utf-8" });

const rows = input
  .trim()
  .split("\n")
  .map((t) => t.trim());

const fromBinary = (array) => array.reverse().reduce((s, v, i) => s + v * 2 ** i, 0);

const part1 = () => {
  const gamma = []; // most common bit
  const epsilon = []; // least common bit

  const numDigits = rows[0].length;

  const sum = "0".repeat(numDigits).split("").map(Number);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (let j = 0; j < row.length; j++) {
      sum[j] += Number(row[j]);
    }
  }

  for (let i = 0; i < sum.length; i++) {
    if (sum[i] > rows.length / 2) {
      gamma[i] = 1;
      epsilon[i] = 0;
    } else {
      gamma[i] = 0;
      epsilon[i] = 1;
    }
  }

  const gammaValue = fromBinary(gamma);
  const epsilonValue = fromBinary(epsilon);

  return gammaValue * epsilonValue;
};

const part2 = () => {
  const numDigits = rows[0].length;

  let oxygen = [...rows];
  let co2 = [...rows];

  // Keep only numbers selected by the bit criteria for the type of rating value for which you are searching.
  // Discard numbers which do not match the bit criteria.
  // If you only have one number left, stop; this is the rating value for which you are searching.
  // Otherwise, repeat the process, considering the next bit to the right.
  for (let i = 0; i < numDigits; i++) {
    if (oxygen.length > 1) {
      // To find oxygen generator rating, determine the most common value (0 or 1) in the current bit position,
      // and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with
      // a 1 in the position being considered.
      const mostCommonBit = findBit(oxygen, i, true);

      //   console.log("Index =", i, "| Most common bit is", mostCommonBit);

      oxygen = oxygen.filter((row) => row[i] === mostCommonBit);

      //   console.log("Index =", i, oxygen.length, oxygen);
    }

    if (co2.length > 1) {
      // To find CO2 scrubber rating, determine the least common value (0 or 1) in the current bit position,
      // and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with
      // a 0 in the position being considered.
      const leastCommonBit = findBit(co2, i, false);

      co2 = co2.filter((row) => row[i] === leastCommonBit);
    }

    if (oxygen.length === 1 && co2.length === 1) {
      break;
    }
  }

  if (oxygen.length > 1) {
    console.error("More than 1 oxygen row left!");
    return;
  }

  if (co2.length > 1) {
    console.error("More than 1 CO2 row left!");
    return;
  }

  //   console.log("Oxygen", oxygen);
  //   console.log("CO2", co2);

  // Use the binary numbers in your diagnostic report to calculate the oxygen generator rating and CO2 scrubber rating, then multiply them together.

  const oxygenRating = fromBinary(oxygen.pop().split(""));
  const co2Rating = fromBinary(co2.pop().split(""));

  console.log("Oxygen Rating", oxygenRating);
  console.log("CO2 Rating", co2Rating);

  return oxygenRating * co2Rating;
};

const findBit = (rows = [], i = 0, mostCommon = true) => {
  const ones = [];
  const zeroes = [];

  rows.forEach((row) => {
    if (row[i] === "1") {
      ones.push(row);
    } else {
      zeroes.push(row);
    }
  });

  if (ones.length + zeroes.length !== rows.length) {
    console.error("Invalid row count:", ones.length, "+", zeroes.length, "!=", rows.length);
    throw new Error();
  }

  //   if (mostCommon) {
  //     console.log(`Index = ${i} | 1 bits = ${ones.length} | 0 bits = ${zeroes.length}`);
  //   }

  if (mostCommon) {
    return ones.length >= zeroes.length ? "1" : "0";
  } else {
    return zeroes.length <= ones.length ? "0" : "1";
  }
};

console.log("Part 1:", part1());
console.log("Part 2:", part2());
