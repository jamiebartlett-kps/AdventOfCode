import { readPuzzleInput } from '../utils.mjs';

const fullInput = readPuzzleInput(13);
const testInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

const underReview = fullInput;

const ruleRegex = /Button ([AB]): X([+-][0-9]+), Y([+-][0-9]+)/;
const targetRegex = /Prize: X=([0-9]+), Y=([0-9]+)/;

const delta = 10000000000000;

const games = [];
let rule = {};
underReview.trim().split("\n").forEach((line) => {
    const ruleMatch = line.match(ruleRegex);
    const targetMatch = line.match(targetRegex);
    if (ruleMatch) {
        const [_, button, x, y] = ruleMatch;
        rule[button] = { x: parseInt(x), y: parseInt(y) };
    } else if (targetMatch) {
        const [_, x, y] = targetMatch;
        rule.target = { x: parseInt(x) + delta, y: parseInt(y) + delta };
        games.push({ ...rule });
        rule = {};
    }
});

let tokenTally = 0;
games.forEach((rule) => {
    const determinant = (rule.A.x * rule.B.y) - (rule.B.x * rule.A.y);

    if (determinant == 0) {
        return;
    }

    const a = ((rule.target.x * rule.B.y) - (rule.B.x * rule.target.y)) / determinant;
    const b = ((rule.A.x * rule.target.y) - (rule.target.x * rule.A.y)) / determinant;

    const factorial = { a, b };

    tokenTally += calculateFactorialCost(factorial);
});

console.log(tokenTally);

function calculateFactorialCost({ a, b }) {
    if (Number.isInteger(a) && Number.isInteger(b)) {
        return (a * 3) + b;
    } else {
        return 0;
    }
}
