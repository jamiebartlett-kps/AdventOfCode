import {readPuzzleInput} from '../utils.mjs';

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
Prize: X=18641, Y=10279`

const underReview = fullInput;

const ruleRegex = /Button ([AB]): X([+-][0-9]+), Y([+-][0-9]+)/
const targetRegex = /Prize: X=([0-9]+), Y=([0-9]+)/

const games = [];
let rule = {};
underReview.trim().split("\n").forEach((line) => {
    const ruleMatch = line.match(ruleRegex);
    const targetMatch = line.match(targetRegex);
    if (ruleMatch){
        const [_,button,x,y] = ruleMatch
        rule[button] = {x:parseInt(x),y:parseInt(y)};
    } else if (targetMatch) {
        const [_,x,y] = targetMatch;
        rule.target = {x:parseInt(x),y:parseInt(y)};
        games.push({...rule});
        rule = {};
    }
});

let tokenTally = 0;
games.forEach((rule) => {
    let maxAPresses = calculateMaxPresses(rule.A, rule.target);
    let maxBPresses = calculateMaxPresses(rule.B, rule.target);
    const factorials = []
    for (let a=0;a<maxAPresses;a++){
        for (let b=0;b<maxBPresses;b++){
            const totalX = (a*rule.A.x) + (b*rule.B.x);
            const totalY = (a*rule.A.y) + (b*rule.B.y);
            if (totalX == rule.target.x && totalY == rule.target.y){
                factorials.push({a,b});
            }
        }
    }
    if (factorials.length > 0){
        factorials.sort((f1, f2) => calculateFactorialCost(f1) - calculateFactorialCost(f2));
        tokenTally += calculateFactorialCost(factorials[0]);
    }
});

console.log(tokenTally);

function calculateMaxPresses(button, target){
    let maxXPresses = Math.ceil(target.x / button.x);
    let maxYPresses = Math.ceil(target.y / button.y);
    return (maxXPresses > maxYPresses) ? maxYPresses : maxXPresses;
}

function calculateFactorialCost({a,b}){
    return (a*3) + b;
}
