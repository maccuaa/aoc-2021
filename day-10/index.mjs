import fs from "fs";

const input = fs.readFileSync("./day-10/input.txt", { encoding: "utf-8" }).trim().split("\n");

const part1 = () => {
  const illegalChars = {
    ")": 0,
    "]": 0,
    "}": 0,
    ">": 0,
  };

  input.forEach((row) => {
    const chars = row.split("");

    const stack = [];

    for (let char of chars) {
      switch (char) {
        case "(":
        case "[":
        case "{":
        case "<":
          stack.push(char);
          continue;
      }

      const open = stack.pop();

      let illegal = false;

      if (open === "(" && char !== ")") {
        illegal = true;
      }

      if (open === "[" && char !== "]") {
        illegal = true;
      }

      if (open === "{" && char !== "}") {
        illegal = true;
      }

      if (open === "<" && char !== ">") {
        illegal = true;
      }

      if (illegal) {
        illegalChars[char] += 1;
      }
    }
  });

  console.log(illegalChars);

  const sum = Object.entries(illegalChars).reduce((s, [c, n]) => {
    if (c === ")") {
      return s + n * 3;
    }

    if (c === "]") {
      return s + n * 57;
    }

    if (c === "}") {
      return s + n * 1197;
    }

    if (c === ">") {
      return s + n * 25137;
    }

    throw new Error("Unexpected character: " + c);
  }, 0);

  return sum;
};

const part2 = () => {
  const scores = input
    .map((row) => {
      const chars = row.split("");

      const stack = [];

      for (let char of chars) {
        switch (char) {
          case "(":
          case "[":
          case "{":
          case "<":
            stack.push(char);
            continue;
        }

        const open = stack.pop();

        if (open === "(" && char !== ")") {
          return;
        }

        if (open === "[" && char !== "]") {
          return;
        }

        if (open === "{" && char !== "}") {
          return;
        }

        if (open === "<" && char !== ">") {
          return;
        }
      }

      const addedChars = [];

      while (stack.length > 0) {
        switch (stack.pop()) {
          case "(":
            addedChars.push(")");
            break;
          case "[":
            addedChars.push("]");
            break;
          case "{":
            addedChars.push("}");
            break;
          case "<":
            addedChars.push(">");
            break;
        }
      }

      return addedChars.reduce((s, c) => {
        const newScore = s * 5;

        switch (c) {
          case ")":
            return newScore + 1;
          case "]":
            return newScore + 2;
          case "}":
            return newScore + 3;
          case ">":
            return newScore + 4;
        }

        throw new Error("Unexpected character " + c);
      }, 0);
    }, 0)
    .filter(Number);

  const sorted = scores.sort((a, b) => b - a);

  return sorted[Math.floor(sorted.length / 2)];
};

const p1 = part1();
const p2 = part2();

console.log("Part 1:", p1, p1 === 374061);
console.log("Part 2:", p2, p2 === 2116639949);
