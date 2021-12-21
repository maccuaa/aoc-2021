import fs from "fs";

const input = fs.readFileSync("./day-15/input.txt", { encoding: "utf-8" }).trim().split("\n");

class Gps {
  map = [
    [
      {
        id: "",
        risk: 0,
        pathRisk: Infinity,
        visited: false,
        up: null,
        down: null,
        left: null,
        right: null,
      },
    ],
  ];

  constructor(seedMap = [[0]]) {
    this.map = seedMap.map((row, i) =>
      row.map((risk, j) => ({
        id: `${i}:${j}`,
        risk,
        pathRisk: Infinity,
        visited: false,
        up: null,
        down: null,
        left: null,
        right: null,
      }))
    );

    this.linkNodes();
  }

  linkNodes = () => {
    for (let x = 0; x < this.map.length; x++) {
      for (let y = 0; y < this.map.length; y++) {
        const node = this.map[y][x];
        if (x > 0) node.left = this.map[y][x - 1];
        if (x < this.map.length - 1) node.right = this.map[y][x + 1];
        if (y > 0) node.up = this.map[y - 1][x];
        if (y < this.map.length - 1) node.down = this.map[y + 1][x];
      }
    }
  };

  updatePathRisk = (from, to) => {
    const newRisk = from.pathRisk + to.risk;
    if (newRisk < to.pathRisk) {
      to.pathRisk = newRisk;
    }
  };

  pickNextFromQueue = (nodeQueue = []) => {
    let next = null;
    for (const node of nodeQueue) {
      if (next === null || node.pathRisk < next.pathRisk) {
        next = node;
      }
    }
    return next;
  };

  run = () => {
    this.map[0][0].pathRisk = 0;
    const exit = this.map[this.map.length - 1][this.map.length - 1];

    let nodeQueue = [this.map[0][0]];

    while (nodeQueue.length > 0) {
      // Stop when the exit is visited
      if (exit.visited) {
        break;
      }

      // Get the next unvisited node
      // const current = nodeQueue.shift();

      const current = nodeQueue.reduce((next, curr) => {
        if (curr.pathRisk < next.pathRisk) {
          return curr;
        }
        return next;
      }, nodeQueue[0]);

      if (current.visited) {
        continue;
      }

      // const current = this.pickNextFromQueue(nodeQueue);

      // Update risks of all connections
      if (current.up && !current.up.visited) {
        this.updatePathRisk(current, current.up);
        nodeQueue.push(current.up);
      }

      if (current.down && !current.down.visited) {
        this.updatePathRisk(current, current.down);
        nodeQueue.push(current.down);
      }

      if (current.right && !current.right.visited) {
        this.updatePathRisk(current, current.right);
        nodeQueue.push(current.right);
      }

      if (current.left && !current.left.visited) {
        this.updatePathRisk(current, current.left);
        nodeQueue.push(current.left);
      }

      current.visited = true;
      nodeQueue = nodeQueue.filter((x) => x.id !== current.id);
    }

    return exit.pathRisk;
  };
}

const part1 = () => {
  const seedMap = input.map((row) => row.split("").map(Number));

  const gps = new Gps(seedMap);

  return gps.run();
};

const part2 = () => {
  const seedMap = input.map((row) => row.split("").map(Number));

  const initialSize = seedMap.length;
  for (let y = 0; y < initialSize; y++) {
    const row1 = seedMap[y];
    for (let rY = 0; rY < 5; rY++) {
      const y2 = rY * initialSize + y;
      const row2 = seedMap[y2] || (seedMap[y2] = []);
      for (let x = 0; x < initialSize; x++) {
        for (let rX = 0; rX < 5; rX++) {
          // Skip 0,0 (don't project into the source)
          if (rY === 0 && rX === 0) {
            continue;
          }

          // Compute location to project to
          const x2 = rX * initialSize + x;

          // Compute the new risk value
          const increase = rX + rY;
          let newRisk = row1[x] + increase;
          if (newRisk > 9) {
            newRisk = newRisk % 9;
          }

          // Project the value
          row2[x2] = newRisk;
        }
      }
    }
  }

  const gps = new Gps(seedMap);

  return gps.run();
};

const p1 = part1();
const p2 = part2();

console.log("Part 1:", p1, p1 === 769);
console.log("Part 2:", p2, p2 === 2970); // 2970 too high, 2962 too low
