import { arraysEqual, readPuzzleInput } from "../utils.mjs";

const fullInput = readPuzzleInput(19);
const testInput = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`

const underReview = fullInput;

let [available, combinations] = underReview.trim().split("\n\n");
available = available.split(", ").map((stripes) => stripes.split(""));
combinations = combinations.split("\n").map((combi) => combi.split(""));

const seen = new Map();

combinations = combinations.map((combi, index) => {
    const possible = addToStub([], combi);
    return {combi,possible}; 
});

function addToStub(stub, target){
    const checkedKey = `${stub.join(",")}|${target.join(",")}`;
    if (seen.has(checkedKey)){
        return seen.get(checkedKey);
    }

    if (arraysEqual(stub, target)){
        seen.set(checkedKey, true);
        return true;
    }

    const targetStub = target.slice(stub.length);

    const possibles = available.filter((aStub) => {
        const notTooLong = targetStub.length >= aStub.length
        const correctFit = arraysEqual(aStub, targetStub.slice(0, aStub.length))
        return notTooLong && correctFit;
    });
    if (possibles.length == 0){
        seen.set(checkedKey, false);
        return false;
    }
    
    for (let possible of possibles){
        if(addToStub([...stub, ...possible], target)){
            seen.set(checkedKey, true);
            return true;
        }
    }

    seen.set(checkedKey, true);
    return false;
}

console.log(combinations.filter(({possible}) => possible).length);