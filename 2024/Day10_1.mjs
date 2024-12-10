import fs from 'fs';
import { createGrid, directions, outOfBounds, dedupe } from './utils.mjs';

const fullInput = fs.readFileSync('./Input/Day10.txt', 'utf-8');
const testInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

const underReview = fullInput;
const grid = createGrid(underReview, (a) => parseInt(a));

const zeroes = []
grid.forEach((col, x) => {
    col.forEach((square, y) => {
        if (square == 0){
            zeroes.push({x,y});
        }
    })
});

function findTrailHeads(pos){
    let trailHeads = [];
    const square = grid[pos.x][pos.y];
    const lookingFor = square + 1;

    for (let {x,y} of directions){
        const newPos = {
            x: pos.x + x,
            y: pos.y + y
        }
        if (!outOfBounds(newPos, grid)){
            const newSquare = grid[newPos.x][newPos.y];
            if (newSquare == lookingFor){
                if (newSquare == 9){
                    trailHeads = [...trailHeads, newPos];
                } else {
                    trailHeads = [...trailHeads, ...findTrailHeads(newPos)];
                }
            }
        }
    }
    return dedupe(trailHeads);
}

const tally = zeroes.map((zero) => findTrailHeads(zero)).map((a) => a.length).reduce((acc, count) => acc += count, 0);
console.log(tally);