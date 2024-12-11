import { readPuzzleInput, wordMap } from "../utils.mjs";

const fullInput = readPuzzleInput(1, 2023);
const testInput = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`

const underReview = fullInput;

const regex = /([\d]{1}|one|two|three|four|five|six|seven|eight|nine)/g


const tally = underReview
                .trim()
                .split("\n")
                .map((line) => line.match(regex))
                .map((arr) => parseInt(`${getDigitFromMatch(arr[0])}${getDigitFromMatch(arr[arr.length-1])}`))
                .reduce((acc, num) => acc += num);

function getDigitFromMatch(input){
    return wordMap[input] ? wordMap[input] : input
}

console.log(tally);