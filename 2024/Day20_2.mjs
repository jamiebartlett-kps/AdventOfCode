import { readPuzzleInput, dedupe, outOfBounds, calculateNewPos, directions, findInGrid, createGrid } from '../utils.mjs'
const fullInput = readPuzzleInput(20);
const testInput = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`

const underReview = fullInput;
const outputThreshold = 100;
const cheatSeconds = 20;

const grid = createGrid(underReview);
const startPos = findInGrid("S", grid);

const queue = [{ pos: startPos, steps: 0, direction: directions[0], sequence : [startPos] }];
const visited = new Map();

const routeSteps = []

while (queue.length > 0){
    const {pos, steps, direction, sequence} = queue.shift();
    const visitedKey = `${pos.x},${pos.y},${direction.dir}`;

    if (visited.has(visitedKey) && visited.get(visitedKey) <= steps){
        continue;
    }
    visited.set(visitedKey, steps);

    const square = grid[pos.x][pos.y];
    if (square == 'E'){
        routeSteps.push({steps, sequence});
        continue;
    }

    for (let nextDirection of directions){
        const newPos = calculateNewPos(pos, nextDirection);
        if (!outOfBounds(newPos, grid)){
            const newSquare = grid[newPos.x][newPos.y];
            if (newSquare == '.' || newSquare == 'E'){
                const newSteps = steps + 1;
                const newVisitedKey = `${newPos.x},${newPos.y},${nextDirection.dir}`;

                if (!visited.has(newVisitedKey) || visited.get(newVisitedKey) > newSteps){
                    queue.push({pos : newPos, steps: newSteps, direction: nextDirection, sequence: [...sequence, newPos]});
                }
            }
        }
    }
}

const route = routeSteps[0].sequence;
let tally = 0;

route.forEach((pos, index) => {
    console.log(`Checking ${index} of ${route.length}`);
    for (let deltaX = -cheatSeconds; deltaX <= cheatSeconds; deltaX++){
        const x = pos.x + deltaX;
        if (x < 0) continue;
        if (x > grid.length - 1) return;

        for (let deltaY = -cheatSeconds; deltaY <= cheatSeconds; deltaY++){
            const y = pos.y + deltaY;
            if (y < 0) continue;
            if ( y > grid[x].length - 1) break;

            const manhattan = Math.abs(deltaY) + Math.abs(deltaX);
            if (manhattan == 0 || manhattan > cheatSeconds) continue;

            const squareIndex = route.findIndex((step) => step.x == x && step.y == y);
            if (squareIndex == -1) continue;
            const cheatScore = squareIndex - index - manhattan;
            if (cheatScore < outputThreshold) continue;

            tally++;
        }
    }
});

console.log(tally);