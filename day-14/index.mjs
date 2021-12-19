import fs from "fs";

const [template, data] = fs.readFileSync("./day-14/input.txt", { encoding: "utf-8" }).trim().split("\n\n");

class Polymer {
  template = new Map();
  rules = new Map();
  lastChar = "";

  constructor() {
    const pairRules = data
      .trim()
      .split("\n")
      .map((x) => x.split(" -> "));

    for (const rule of pairRules) {
      // if you have CH => B
      // CH creates CB and BH
      // add pair rule to set
      // CH : [ CB, BH ]
      this.rules.set(rule[0], [rule[0][0] + rule[1], rule[1] + rule[0][1]]);
    }

    for (let i = 0; i < template.length - 1; i++) {
      const pair = template[i] + template[i + 1];
      this.addToTemplate(this.template, pair);
    }

    this.lastChar = template[template.length - 1];
  }

  addToTemplate = (map = new Map(), pair = "", val = 1) => {
    if (!map.has(pair)) {
      map.set(pair, 0);
    }

    map.set(pair, map.get(pair) + val);
  };

  step = () => {
    const newTemplate = new Map();

    const keys = this.template.keys();

    for (let key of keys) {
      const next = this.rules.get(key);

      this.addToTemplate(newTemplate, next[0], this.template.get(key));
      this.addToTemplate(newTemplate, next[1], this.template.get(key));
    }

    this.template = newTemplate;
  };

  calculate = () => {
    const alphabet = new Map();

    this.addToTemplate(alphabet, this.lastChar);

    const keys = this.template.keys();
    for (const key of keys) {
      this.addToTemplate(alphabet, key[0], this.template.get(key));
    }

    const values = [...alphabet.values()];
    const min = Math.min(...values);
    const max = Math.max(...values);
    console.log(max - min);

    return max - min;
  };
}

const part1 = (steps = 0) => {
  const polymer = new Polymer();

  for (let i = 0; i < steps; i++) {
    polymer.step();
  }

  console.log(polymer.template.length);

  return polymer.calculate();
};

const p1 = part1(10);
const p2 = part1(40);

console.log("Part 1:", p1, p1 === 3247);
console.log("Part 2:", p2, p2 === 4110568157153);
