//We're going to count how often each stone occurs rather than adding the value to a list to avoid OOM
import { readPuzzleInput } from "../utils.mjs";

const fullInput = readPuzzleInput(11);
const testInput = '125 17';

const underReview = fullInput;

const initialStones = underReview.split(" ").map(Number);

function addStone(map, stone, count){
    if (!map[stone]){
        map[stone] = 0;
    }
    map[stone] += count;
    return map;
}

function countStones(map){
    let tally = 0;
    for (let stone of Object.keys(map)){
        const count = map[stone];
        tally += count;
    }
    return tally;
}

let stones = initialStones.reduce((acc, stone) => addStone(acc, stone, 1), {});

const blinks = 25;
for (let i=0; i<blinks; i++){
    const newStones = {};
    for (let stone of Object.keys(stones)){
        const count = stones[stone];
        const stoneString = `${stone}`;
        if (stone == 0){
            addStone(newStones, 1, count);
        } else if (stoneString.length % 2 == 0){
            const left = stoneString.substring(0, stoneString.length / 2);
            const right = stoneString.substring(stoneString.length / 2);
            addStone(newStones, parseInt(left), count)
            addStone(newStones, parseInt(right), count)
        } else {
            addStone(newStones, stone * 2024, count);
        }
    }
    stones = newStones;
}


console.log(countStones(stones));