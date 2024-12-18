import { directions,calculateNewPos, outOfBounds, readPuzzleInput } from "../utils.mjs";

const fullInput = {
    input: readPuzzleInput(18),
    bytesToSimulate: 1024,
    gridSize: {x:71, y:71}
}

const testInput = {
    bytesToSimulate: 12,
    gridSize: {x:7, y:7},
    input : `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`}

const underReview = fullInput

let positions = underReview.input.trim().split("\n").map((line) => {
    const [x,y] = line.split(",");
    return {x,y};
});

positions = positions.slice(0, underReview.bytesToSimulate);

const grid = [];
for (let x=0;x<underReview.gridSize.x;x++){
    grid.push([]);
    for (let y=0;y<underReview.gridSize.y;y++){
        const corrupted = positions.some((pos) => pos.x == x && pos.y == y);
        grid[x][y] = corrupted ? '#' : '.'
    }
}

const startPos = {x:0,y:0};
const targetPos = {x:underReview.gridSize.x-1, y:underReview.gridSize.y-1};
const startDirection = directions[0];

const queue = [{ pos: startPos, steps: 0, direction: startDirection }];
const visited = {};

const routeSteps = [];

while (queue.length > 0) {

    const { pos, steps, direction } = queue.shift();
    const visitedKey = `${pos.x},${pos.y},${direction.dir}`;

    //Have we seen this position before with a lower steps?
    if (visited[visitedKey] && visited[visitedKey] <= steps){
        continue;
    }
    visited[visitedKey] = steps;

    const square = grid[pos.x][pos.y];
    if (pos.x == targetPos.x && pos.y == targetPos.y){
        routeSteps.push(steps);
        continue;
    }

    for (let nextDirection of directions){
        const newPos = calculateNewPos(pos, nextDirection);
        if (!outOfBounds(newPos, grid)){
            const newSquare = grid[newPos.x][newPos.y];

            if (newSquare === '.' || newSquare === 'E') {
                const newSteps = steps + 1;
                const newVisitedKey = `${newPos.x},${newPos.y},${nextDirection}`;

                if (visited[newVisitedKey] == undefined || visited[newVisitedKey] > newSteps) {
                    queue.push({
                        pos: newPos,
                        steps: newSteps,
                        direction: nextDirection,
                    });
                }
            }
        }
    }
}

console.log(Math.min(...routeSteps));