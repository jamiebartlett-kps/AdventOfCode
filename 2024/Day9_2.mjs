import {readPuzzleInput} from './utils.mjs'

const fullInput = readPuzzleInput(9);
const testInput = '2333133121414131402';

const underReview = fullInput;

const definition = underReview.trim().split("");
let blocks = [];
definition.forEach((block, index) => {
    const empty = index % 2 == 1;
    const id = index / 2;
    const blockValue = parseInt(block);
    const newBlock = {
        empty,
        size : blockValue,
        moved : false
    }
    if (!empty) newBlock.id = id;
    blocks.push(newBlock);
});

let loopComplete = false;
while (!loopComplete) {
    for (let i = blocks.length - 1; i >=0; i--){
        const block = blocks[i];
        if (!block.empty && !block.moved){
            block.moved = true;
            const spaceIndex = blocks.findIndex(({empty, size}) => empty && size >= block.size);
            if (spaceIndex != -1 && spaceIndex < i){
                const freeBlock = blocks[spaceIndex];
                freeBlock.size -= block.size;
                const deleteBlocks = freeBlock.size <= 0 ? 1 : 0;
                blocks.splice(i, 1, {...block, empty: true}); //Remove my from where i was
                blocks.splice(spaceIndex, deleteBlocks, {...block}); //Put me in the gap
                
                blocks = combineSpaces(blocks);
                break;
            }
        }
        if (i == 0){
            loopComplete = true;
        }
    }
}

function combineSpaces(blocks){
    for (let x = 1; x < blocks.length; x++){
        const block = blocks[x];
        const previous = blocks[x-1];

        if (block.empty && previous.empty){
            block.size += previous.size;
            previous.size = 0;
        }
    }
    return blocks.filter(({size}) => size > 0);
}

const expandedBlocks = [];
blocks.forEach(({empty, id, size}, index) => {
    for (let i=0; i<size; i++){
        expandedBlocks.push(empty ? '.' : id);
    }
});

let tally = 0;
expandedBlocks.forEach((block, index) => {
    if (block != '.'){
        tally += (block * index);
    }
})

console.log(tally);