import {readPuzzleInput} from '../utils.mjs'

const wordsearch = readPuzzleInput(4);
const testWordsearch = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`

const underReview = wordsearch;

const wordSearchRows = underReview.trim().split("\n");
let wordCount = 0;
const word = "XMAS";

function checkWord(startRow, startCol, xDir, yDir) {
    let foundWord = "";
    try {
        for (let i=0; i<word.length; i++){
            const rowPos = startRow + (yDir*i);
            const colPos = startCol + (xDir*i);
            foundWord += wordSearchRows[rowPos].charAt(colPos);
        }
    } catch {
        return false;
    }
    return foundWord == word;
}

wordSearchRows.forEach((row, rowIndex) => {
    for (let colIndex=0; colIndex<row.length; colIndex++) {
        wordCount += checkWord(rowIndex, colIndex, 0, 1) ? 1 : 0; //north
        wordCount += checkWord(rowIndex, colIndex, 1, 1) ? 1 : 0; //north west
        wordCount += checkWord(rowIndex, colIndex, 1, 0) ? 1 : 0; //west
        wordCount += checkWord(rowIndex, colIndex, 1, -1) ? 1 : 0; //south west
        wordCount += checkWord(rowIndex, colIndex, 0, -1) ? 1 : 0; //south
        wordCount += checkWord(rowIndex, colIndex, -1, -1) ? 1 : 0; //south east
        wordCount += checkWord(rowIndex, colIndex, -1, 0) ? 1 : 0; //east
        wordCount += checkWord(rowIndex, colIndex, -1, 1) ? 1 : 0; //north east
    }
});

console.log(wordCount);