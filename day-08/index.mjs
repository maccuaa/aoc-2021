import fs from "fs";

const input = fs.readFileSync("./day-08/input.txt", { encoding: "utf-8" }).trim().split("\n");

const diff = (setA = new Set(), setB = new Set()) => {
  const diff = new Set(setA);

  for (const elem of setB) {
    diff.delete(elem);
  }

  // console.log(setA, "-", setB, "=", diff);

  return diff;
};

const overlap = (setA = new Set(), setB = new Set()) => {
  const overlap = new Set();

  for (const elem of setA) {
    if (setB.has(elem)) {
      overlap.add(elem);
    }
  }

  return overlap;
};

const matches = (setA = new Set(), setB = new Set()) => {
  for (const elem of setA) {
    if (!setB.has(elem)) {
      return false;
    }
  }

  return setA.size === setB.size;
};

const getValue = (setA = new Set()) => {
  if (setA.size > 1) {
    throw new Error("Multiple values found in set. Size " + setA.size);
  }

  for (const elem of setA) {
    return elem;
  }
};

const toSet = (str = "") => {
  const setA = new Set();
  str.split("").forEach((l) => setA.add(l));
  return setA;
};

const part1 = () => {
  // unique digit lengths
  const uniqueLengths = [
    2, // One
    4, // Four
    3, // Seven
    7, // Eight
  ];

  const sum = input.reduce((sum, row) => {
    const [, right] = row.split(" | ");

    const outputValues = right.split(" ").filter((v) => v.length);

    return (
      sum +
      outputValues.reduce((sum, v) => {
        return uniqueLengths.includes(v.length) ? ++sum : sum;
      }, 0)
    );
  }, 0);

  return sum;
};

const part2 = () => {
  let sum = 0;

  input.forEach((row) => {
    const [left, right] = row.split(" | ");

    const signalPatterns = left
      .split(" ")
      .filter((p) => p.length)
      .map(toSet);
    const outputValues = right.split(" ").filter((v) => v.length);

    // Map the random signal patterns to digits
    const digits = {
      0: new Set(),
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
      5: new Set(),
      6: new Set(),
      7: new Set(),
      8: new Set(),
      9: new Set(),
    };

    // Map the random segment to the actual segment
    const segments = {
      a: "",
      b: "",
      c: "",
      d: "",
      e: "",
      f: "",
      g: "",
    };

    //
    // Decode Signal Patterns
    //

    // Find One
    const onePattern = signalPatterns.find((p) => p.size === 2);
    digits[1] = onePattern;

    // Find Four
    const fourPattern = signalPatterns.find((p) => p.size === 4);
    digits[4] = fourPattern;

    // Find Seven
    const sevenPattern = signalPatterns.find((p) => p.size === 3);
    digits[7] = sevenPattern;

    // Find Eight
    const eightPattern = signalPatterns.find((p) => p.size === 7);
    digits[8] = eightPattern;

    // Find Nine
    const possibleNines = signalPatterns.filter((p) => p.size === 6);
    digits[9] = possibleNines.find((p) => overlap(digits[4], p).size === digits[4].size);

    // Find segment "a"
    const aSet = diff(digits[7], digits[1]);
    const a = getValue(aSet);
    segments.a = a;

    // Find Zero
    const bd = diff(digits[4], digits[1]);
    const zero = possibleNines.find((p) => overlap(p, bd).size === 1);
    digits[0] = zero;

    // Find segment "d"
    segments.d = getValue(diff(bd, zero));

    // Find Six
    const six = possibleNines.filter((p) => !matches(digits[0], p) && !matches(digits[9], p));
    digits[6] = getValue(six);

    // Find segment "c"
    const c = diff(digits[8], digits[6]);
    segments.c = getValue(c);

    // Find segment "b"
    const b = diff(bd, segments.d);
    segments.b = getValue(b);

    // Find segment "e"
    const eSet = diff(digits[8], digits[9]);
    segments.e = getValue(eSet);

    // Find Five
    const twoThreeFive = signalPatterns.filter((p) => p.size === 5);
    const five = twoThreeFive.find((p) => p.has(segments.b));
    digits[5] = five;

    // Find Two
    const two = twoThreeFive.find((p) => p.has(segments.e));
    digits[2] = two;

    // Find Three
    const three = twoThreeFive.find((p) => !p.has(segments.b) && !p.has(segments.e));
    digits[3] = three;

    //
    // Decode Output Values
    //

    let number = "";

    for (let value of outputValues) {
      const valueAsSet = toSet(value);

      const [digit] = Object.entries(digits).find(([, set]) => matches(set, valueAsSet));

      number += digit;
    }

    sum += Number(number);
  });

  return sum;
};

const p1 = part1();
const p2 = part2();

console.log("Part 1:", p1, p1 === 247);
console.log("Part 2:", p2, p2 === 933305);
