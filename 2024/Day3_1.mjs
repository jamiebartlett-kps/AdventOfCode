import {readPuzzleInput} from './utils.mjs'

const contents = readPuzzleInput(3);
const testContents = 'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))';

const regex = /mul\(([0-9]+),([0-9]+)\)/g

let counter = 0;

let match;
while ((match = regex.exec(contents)) !== null) {
    const [a,b] = [parseInt(match[1]), parseInt(match[2])];
    counter += (a*b);
}

console.log(counter);