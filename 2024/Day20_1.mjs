import { readPuzzleInput,dedupe,outOfBounds, calculateNewPos, directions, findInGrid, createGrid } from '../utils.mjs'
const fullInput  = readPuzzleInput(20);
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
const outputThreshold = 101;


const grid = createGrid(underReview);
const startPos = findInGrid("S", grid);
const targetPos = findInGrid("E", grid);

function runGrid(cheat){
const startDirection = directions[0];

const queue = [{ pos: startPos, steps: 0, direction: startDirection, positions:[startPos] }];
const visited = {};

const routeSteps = [];

while (queue.length > 0) {

    const { pos, steps, direction,positions } = queue.shift();
    const visitedKey = `${pos.x},${pos.y},${direction.dir}`;

    //Have we seen this position before with a lower steps?
    if (visited[visitedKey] && visited[visitedKey] <= steps){
        continue;
    }
    visited[visitedKey] = steps;

    const square = grid[pos.x][pos.y];
    if (pos.x == targetPos.x && pos.y == targetPos.y){
        routeSteps.push({steps,positions});
        continue;
    }

    for (let nextDirection of directions){
        const newPos = calculateNewPos(pos, nextDirection);
        if (!outOfBounds(newPos, grid)){
            let newSquare = grid[newPos.x][newPos.y];
	    if (cheat && cheat.x == newPos.x && cheat.y == newPos.y) newSquare = ".";

            if (newSquare === '.' || newSquare === 'E') {
                const newSteps = steps + 1;
                const newVisitedKey = `${newPos.x},${newPos.y},${nextDirection}`;

                if (visited[newVisitedKey] == undefined || visited[newVisitedKey] > newSteps) {
                    queue.push({
                        pos: newPos,
                        steps: newSteps,
                        direction: nextDirection,
			positions: [...positions, newPos]
                    });
                }
            }
        }
    }
}
return routeSteps;
}

const rawGridResponse = runGrid()[0];

let tally= 0;

let checked = [];

rawGridResponse.positions.forEach((pos, index) => {
    for (let direction of directions){
        const wallPos = calculateNewPos(pos,direction);
	const alreadyChecked = checked.some(({x,y}) => x == wallPos.x && y == wallPos.y);
	if (alreadyChecked) continue;
	if (!outOfBounds(wallPos, grid)){
            const wallSquare = grid[wallPos.x][wallPos.y];
	    if (wallSquare == "#"){
		    const nextPos = calculateNewPos(wallPos,direction);
		if (!outOfBounds(nextPos,grid)){
                    const nextSquare = grid[nextPos.x][nextPos.y];
		    if (nextSquare == "." || nextSquare == "E") {
			    const nextIndex = rawGridResponse.positions.findIndex(({x,y}) => x==nextPos.x && y == nextPos.y);
			    if (nextIndex - index >= outputThreshold) tally++;
		    }
		}
	    }
	    checked.push(wallPos);
	}
    }
})

		    console.log(tally);
