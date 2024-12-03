import fs from 'fs';

const contents = fs.readFileSync('./Input/Day1.txt', 'utf-8');
const testContents = `3   4
4   3
2   5
1   3
3   9
3   3`

const underReview = contents;


const listOne = [];
const listTwo = [];

underReview.trim().split('\n').forEach((line) => {
    const [entryOne, entryTwo] = line.split('   ');
    listOne.push(parseInt(entryOne));
    listTwo.push(parseInt(entryTwo));
});

listOne.sort((a,b) => a-b);
listTwo.sort((a,b) => a-b);

const intervals = listOne.map((item, index) => {
    return Math.abs(item - listTwo[index]);
});

const intervalSum = intervals.reduce((acc, interval) => acc + interval, 0);
console.log(intervalSum);