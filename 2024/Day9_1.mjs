import fs from 'fs';

const fullInput = fs.readFileSync('./Input/Day9.txt', 'utf-8');
const testInput = '2333133121414131402';

const underReview = fullInput;

const definition = underReview.trim().split("");
const blocks = [];
definition.forEach((block, index) => {
    const space = index % 2 == 1;
    const id = index / 2;
    const blockValue = parseInt(block);
    for (let i=0; i<blockValue; i++){
        blocks.push(space ? '.' : id);
    }
});

//Now order it
while(!isValid(blocks)){
    const firstDot = blocks.indexOf(".");
    //find the last number
    for (let i = blocks.length - 1; i >= 0; i--){
        const test = blocks[i];
        if (test != '.'){
            //This is the last number, let's swap them
            blocks[firstDot] = test;
            blocks[i] = '.';
            break;
        }
    }
}

let tally = 0;
blocks.forEach((block, index) => {
    if (block != '.'){
        tally += (block * index);
    }
})

console.log(tally);


function isValid(arr){
    let shouldBeNumber = true;
    for (let val of arr){
        if (shouldBeNumber && val == "."){
            shouldBeNumber = false;
        } else if (!shouldBeNumber && val != "."){
            return false;
        }
    }
    return true;
}