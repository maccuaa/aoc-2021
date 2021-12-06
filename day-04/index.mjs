import fs from "fs";

const input = fs.readFileSync("./day-04/input.txt", { encoding: "utf-8" });

const rows = input
  .trim()
  .split("\n")
  .map((t) => t.trim());

const readBingoCards = () => {
  const bingoNumbers = [];
  const bingoCards = [];

  let bingoCard = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();

    // The first row contains the bingo numbers
    if (i === 0) {
      bingoNumbers.push(...row.split(","));
      continue;
    }

    // The next row is a blank
    if (row.length === 0) {
      if (bingoCard.length > 0) {
        bingoCards.push(bingoCard);
        bingoCard = [];
      }
      continue;
    }

    bingoCard.push(row.split(" ").filter((x) => x.length > 0));
  }

  bingoCards.push(bingoCard);

  return { bingoCards, bingoNumbers };
};

const part1 = () => {
  //
  // Read in all the bingo cards
  //
  const { bingoCards, bingoNumbers } = readBingoCards();

  //
  // Time to play bingo!
  //

  for (const bingoNumber of bingoNumbers) {
    // Cross off any matches
    for (const bingoCard of bingoCards) {
      for (const row of bingoCard) {
        for (let i = 0; i < row.length; i++) {
          if (row[i] === bingoNumber) {
            delete row[i];
          }
        }
      }
    }

    // Check if we have any winners
    const winningCard = bingoCards.find((bingoCard) => {
      // Check for a winning row
      for (const row of bingoCard) {
        if (row.every((c) => c === undefined)) {
          return true;
        }
      }

      // Check for a winning column
      for (let c = 0; c < bingoCard[0].length; c++) {
        const column = [];

        for (let r = 0; r < bingoCard.length; r++) {
          column.push(bingoCard[r][c]);
        }

        if (column.every((r) => r === undefined)) {
          return true;
        }
      }

      return false;
    });

    if (winningCard) {
      // console.log("BINGO!", bingoNumber);

      // Start by finding the sum of all unmarked numbers on that board
      const sum = winningCard.reduce((sum, row) => sum + row.reduce((s, v) => s + +v, 0), 0);

      // console.log(sum, "x", bingoNumber, "=", sum * bingoNumber);

      // multiply that sum by the number that was just called when the board won
      return sum * bingoNumber;
    }
  }

  console.error("No winning bingo cards found :(");
};

class BingoCard {
  constructor(board = [[], []]) {
    this.board = board;
  }

  mark(number) {
    for (const row of this.board) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === number) {
          delete row[i];
        }
      }
    }
  }

  get hasBingo() {
    // Check for a winning row
    for (const row of this.board) {
      if (row.every((c) => c === undefined)) {
        return true;
      }
    }

    // Check for a winning column
    for (let c = 0; c < this.board[0].length; c++) {
      const column = [];

      for (let r = 0; r < this.board.length; r++) {
        column.push(this.board[r][c]);
      }

      if (column.every((r) => r === undefined)) {
        return true;
      }
    }

    return false;
  }

  get sum() {
    return this.board.flat().reduce((s, v) => s + +v, 0);
  }
}

const part2 = () => {
  //
  // Read in all the bingo cards
  //
  const data = readBingoCards();

  //
  // Time to play bingo!
  //

  let bingoCards = data.bingoCards.map((x) => new BingoCard(x));

  for (const bingoNumber of data.bingoNumbers) {
    // Cross off any matches
    for (const bingoCard of bingoCards) {
      bingoCard.mark(bingoNumber);
    }

    // if we're down to the last card and it's a winner then stop.
    if (bingoCards.length === 1 && bingoCards[0].hasBingo) {
      return bingoCards[0].sum * bingoNumber;
    }

    // only keep the losers
    bingoCards = bingoCards.filter((bingoCard) => !bingoCard.hasBingo);
  }
};

console.log("Part 1:", part1());
console.log("Part 2:", part2());
