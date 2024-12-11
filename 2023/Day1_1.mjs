import { readPuzzleInput } from "../utils.mjs";

const fullInput = readPuzzleInput(1, 2023);
const testInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`

const underReview = fullInput;

const regex = /([\d]{1})/g

const tally = underReview
                .trim()
                .split("\n")
                .map((line) => line.match(regex))
                .map((arr) => parseInt(`${arr[0]}${arr[arr.length-1]}`))
                .reduce((acc, num) => acc += num);

console.log(tally);