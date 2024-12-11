import { directions, createGrid, readPuzzleInput, outOfBounds, dedupe } from '../utils.mjs';

const fullInput = readPuzzleInput(6);
const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`

const underReview = fullInput;

const grid = createGrid(underReview);

let turnCount = 0;

//First we find the start point
let position = {x : 0, y: 0}
let visited = [];

grid.forEach((col, x) => 
    col.forEach((square, y) => {
        if (square == '^'){
            position = {x,y};
            visited.push(position);
        }
    })
)

while (!outOfBounds(position, grid)){
    const direction = directions[turnCount % 4]
    let newPosition = {
        x : position.x + direction.x,
        y : position.y + direction.y
    }
    if (outOfBounds(newPosition, grid)){
        break;
    }
    if (grid[newPosition.x][newPosition.y] == '#'){
        turnCount++;
        continue;
    } else {
        position = newPosition;
        visited.push(position);
    }
}

//De dupe the visited list
export const uniqueVisited = dedupe(visited);

console.log(uniqueVisited.length);