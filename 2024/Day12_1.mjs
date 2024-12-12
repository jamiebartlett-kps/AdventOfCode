import { createGrid, readPuzzleInput, directions, outOfBounds, dedupe } from "../utils.mjs";

const fullInput = readPuzzleInput(12);
const testInput = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`

const underReview = fullInput;

const grid = createGrid(underReview);
let groups = [];

grid.forEach((col, x) => {
    col.forEach((square, y) => {
        const alreadyInGroup = groups.some(({crop, positions}) => crop == square && positions.some((newPos) => newPos.x == x && newPos.y == y));
        if (!alreadyInGroup){
            groups.push(getEntireGroup(square, {x,y}));
        }
    });
});

groups = groups.map((group) => ({crop : group.crop, area: group.positions.length, fences: calculatePermiters(group)}));
const tally = groups.reduce((acc, {area, fences}) => acc += (area * fences), 0);

console.log(tally);

function getEntireGroup(crop, pos, allPositions = []){
    allPositions.push(pos);
    for (const direction of directions){
        const newPos = {x:pos.x+direction.x,y:pos.y+direction.y};
        const alreadySeen = allPositions.some(({x,y}) => x == newPos.x && y == newPos.y);
        if (!alreadySeen){
            if (!outOfBounds(newPos, grid)){
                const newCrop = grid[newPos.x][newPos.y];
                if (newCrop == crop){
                    allPositions = getEntireGroup(crop, newPos, allPositions).positions;
                }
            }
        }
    }
    return {
        crop,
        positions: dedupe(allPositions)
    }
}

function calculatePermiters({crop, positions}){
    let fenceTally = 0;
    for (const pos of positions){
        for (const direction of directions){
            const checkPos = {x: pos.x+direction.x, y: pos.y+direction.y};
            if (!outOfBounds(checkPos, grid)){
                const checkCrop = grid[checkPos.x][checkPos.y];
                if (checkCrop != crop) fenceTally++;
            } else {
                fenceTally++;
            }
        }
    }
    return fenceTally;
}