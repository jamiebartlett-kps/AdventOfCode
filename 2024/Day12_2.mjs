import { createGrid, readPuzzleInput, directions, outOfBounds, dedupe,calculateNewPos } from "../utils.mjs";

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

groups.forEach((group) => addEdges(group));
groups.forEach((group) => group.fences = getFences(group));
groups.forEach((group) => group.fenceCount = countFences(group));

groups = groups.map((group) => ({crop : group.crop, area: group.positions.length, fences: group.fenceCount}));
const tally = groups.reduce((acc, {area, fences}) => acc += (area * fences), 0);

console.log(tally);

function getEntireGroup(crop, pos, allPositions = []){
    allPositions.push(pos);
    for (const direction of directions){
        const newPos = calculateNewPos(pos, direction);
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

function addEdges({crop, positions}){
    for (const pos of positions){
        pos.edges = [];
        for (const direction of directions){
            const newPos = calculateNewPos(pos, direction);
            if (!outOfBounds(newPos, grid)){
                const newCrop = grid[newPos.x][newPos.y];
                if (newCrop != crop){
                    pos.edges.push(direction.dir);
                }
            } else {
                pos.edges.push(direction.dir);
            }
        }
        pos.edges = [...new Set(pos.edges)];
    }
}

function getFences({positions}){
    return positions.reduce((acc, pos) => {
        for (const edge of pos.edges){
            if (!acc[edge]) acc[edge] = []
            acc[edge].push(pos)
        }
        return acc;
    },{})
}

function countFences({fences}){
    let tally = 0;
    for (const dir of Object.keys(fences)){
        const posKey = (dir == "up" || dir == "down") ? 'y' : 'x';
        const otherKey = (dir == "up" || dir == "down") ? 'x' : 'y';
        // we need to group them by posKey then work out how many sequences there are of the other key
        let posMap = fences[dir].reduce((acc, fence) => {
            if (!acc[fence[posKey]]) acc[fence[posKey]] = [];
            acc[fence[posKey]].push(fence[otherKey]);
            return acc;
        }, {})
        Object.values(posMap).forEach((v) => tally += countSequences(v))
    }
    return tally;
}

function countSequences(arr){
    let sequenceCont = 1;
    arr.sort((a,b) => a-b);
    for (let i=1;i<arr.length;i++){
        if (arr[i] - arr[i-1] > 1) sequenceCont++;
    }
    return sequenceCont;
}