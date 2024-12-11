import {readPuzzleInput} from '../utils.mjs'

const contents = readPuzzleInput(3);
const testContents = 'xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))';

const underReview = contents;


const regex = /mul\(([0-9]+),([0-9]+)\)/g
let counter = 0;
let commandBuffer = "";
let textBuffer = "";

let processText = true;

//Loop through the string character by character.
for (let x=0; x<underReview.length; x++){
    const char = underReview.charAt(x);

    //Because do and don't both start with D, we can clear the buffer on a D
    if (char == 'd'){
        commandBuffer = "";
    }

    //Update the two buffers
    commandBuffer += char;
    textBuffer += char;

    //If we see either a do or a don't
    if (commandBuffer == 'do()' || commandBuffer == 'don\'t()'){
        //If we're supposed to be 'doing' this chunk, add it
        if (processText){
            counter += calculateChunk(textBuffer);
        }
        //Reset the text buffer, set the 'doing' boolean, then reset the command buffer
        textBuffer = "";
        processText = commandBuffer == 'do()';
        commandBuffer = "";
    }
}

//Process the last chunk if we should
if (processText){
    counter += calculateChunk(textBuffer);
}

console.log(counter);


function calculateChunk(chunk){
    let scopeCounter = 0;
    let match;
    while ((match = regex.exec(chunk)) !== null) {
        const [a,b] = [parseInt(match[1]), parseInt(match[2])];
        scopeCounter += (a*b);
    }
    return scopeCounter;
}