import fs from 'fs';

const wordsearch = fs.readFileSync('./Input/Day4.txt', 'utf-8');
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
let crossCount = 0;
const word = "MAS";

function checkCross(rowStart, colStart) {
    try {
        const centre = wordSearchRows[rowStart].charAt(colStart);
        if (centre != 'A') return false;
        const nw = getDiaganal(rowStart, colStart, -1, -1);
        const ne = getDiaganal(rowStart, colStart, 1, -1);
        const sw = getDiaganal(rowStart, colStart, -1, 1);
        const se = getDiaganal(rowStart, colStart, 1, 1);
        return ![nw, ne, sw, se].some((dir) => !checkWord(dir));
    } catch {
        return false;
    }
}

function getDiaganal(rowStart, colStart, xDir, yDir){
    let diaganal = "";
    for (let i=0; i<word.length; i++){
        const rowPos = (rowStart - yDir) + (yDir*i);
        const colPos = (colStart - xDir) + (xDir*i);
        diaganal += wordSearchRows[rowPos].charAt(colPos);
    }
    return diaganal;
}

function checkWord(inputWord){
    return inputWord == word || inputWord.split('').reverse().join('') == word;
}

wordSearchRows.forEach((row, rowIndex) => {
    for (let colIndex=0; colIndex<row.length; colIndex++) {
        const valid = checkCross(rowIndex, colIndex);
        if (valid) crossCount++;
    }
});

console.log(crossCount);