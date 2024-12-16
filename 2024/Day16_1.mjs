import { calculateNewPos, createGrid, directions, findInGrid, outOfBounds, readPuzzleInput } from "../utils.mjs";

const fullInput = readPuzzleInput(16);
const testInput = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`

const underReview = fullInput;

const grid = createGrid(underReview);

const startPos = findInGrid('S',grid);

const routeCosts = [];

function routeToFinish(startPos, startDirection){
    const queue = [{ pos: startPos, score: 0, direction: startDirection }];
    const visited = {};

    while (queue.length > 0) {
        const { pos, score, direction } = queue.shift();
        const visitedKey = `${pos.x},${pos.y},${direction.dir}`;

        //Have we seen this position before with a lower score?
        if (visited[visitedKey] && visited[visitedKey] <= score){
            continue;
        }
        visited[visitedKey] = score;

        const square = grid[pos.x][pos.y];
        if (square == 'E'){
            routeCosts.push(score);
            continue;
        }

        for (let nextDirection of directions){
            const newPos = calculateNewPos(pos, nextDirection);
            const newSquare = grid[newPos.x][newPos.y];

            if (newSquare === '.' || newSquare === 'E') {
                const turnCost = calculateTurnCost(direction, nextDirection);
                const newScore = score + 1 + turnCost;
                const newVisitedKey = `${newPos.x},${newPos.y},${nextDirection}`;

                if (visited[newVisitedKey] == undefined || visited[newVisitedKey] > newScore) {
                    queue.push({
                        pos: newPos,
                        score: newScore,
                        direction: nextDirection,
                    });
                }
            }
        }
    }
}

function calculateTurnCost(startDir, finishDir){
    const clockwise = calculateTurns(startDir, finishDir);
    const counterClockwise = calculateTurns(startDir, finishDir, -1);

    if (counterClockwise < clockwise){
        return counterClockwise * 1000;
    } else {
        return clockwise * 1000;
    }
}

function calculateTurns(startDir, finishDir, diff = 1){
    let turns = 0;
    let startIndex = directions.findIndex(({x,y}) => startDir.x == x && startDir.y == y);
    const finishIndex = directions.findIndex(({x,y}) => finishDir.x == x && finishDir.y == y);

    while (startIndex != finishIndex){

        startIndex += diff
        if (startIndex == -1) startIndex = 3;
        startIndex = startIndex % 4;

        turns++;
        
    }

    return turns;
}

routeToFinish(startPos, directions[1]);
console.log(Math.min(...routeCosts));
