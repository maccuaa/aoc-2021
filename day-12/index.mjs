import fs from "fs";

const input = fs.readFileSync("./day-12/input.txt", { encoding: "utf-8" }).trim().split("\n");

class Caves {
  map = new Map();

  routes = new Set();

  p1 = false;

  constructor(p1 = false) {
    this.p1 = p1;

    input.forEach((path) => {
      const [start, end] = path.split("-").sort();

      this.addPath(start, end);
      this.addPath(end, start);
    });
  }

  isSmallCave = (i = "") => /[a-z]+/.test(i) && i !== "start";

  addPath = (start = "", end = "") => {
    if (!this.map.has(start)) {
      this.map.set(start, new Set());
    }

    this.map.get(start).add(end);
  };

  visitedOnce = (route = [""], c = "") => route.includes(c);

  visitedTwice = (route = [""], c = "") => {
    // a small cave can only be visited twice
    if (route.filter((r) => r === c).length > 1) {
      return true;
    }

    // only a single small cave can be visited twice
    if (route.includes(c)) {
      // make sure no other caves have been visited twice
      for (let r of route) {
        if (this.isSmallCave(r) && route.filter((i) => i === r).length > 1) {
          return true;
        }
      }
    }
    return false;
  };

  navigate = (route = [""]) => {
    // get the current location
    const current = route.pop();

    // if we found the end then add it to the list of routes
    if (current === "end") {
      this.routes.add(route.concat(current).join(","));
      return;
    }

    // visit small caves at most once
    // if we're in a small cave, make sure we haven't
    // already visited this small cave
    if (this.isSmallCave(current)) {
      if (this.p1 && this.visitedOnce(route, current)) {
        return;
      }

      if (!this.p1 && this.visitedTwice(route, current)) {
        return;
      }
    }

    const options = this.map.get(current);

    for (const path of options) {
      if (path !== "start") {
        this.navigate([...route, current, path]);
      }
    }
  };
}

const part1 = () => {
  const caves = new Caves(true);

  caves.navigate(["start"]);

  return caves.routes.size;
};

const part2 = () => {
  const caves = new Caves(false);

  caves.navigate(["start"]);

  return caves.routes.size;
};

const p1 = part1();
const p2 = part2();

console.log("Part 1:", p1, p1 === 3485);
console.log("Part 2:", p2, p2 === 85062);
