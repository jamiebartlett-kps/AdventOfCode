import fs from 'fs';

const fullInput = fs.readFileSync('./Input/Day6.txt', 'utf-8');
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

const grid = underReview.trim().split("\n").map((line) => line.split(""));
const directions = [
    {x:0,y:-1},
    {x:1,y:0},
    {x:0,y:1},
    {x:-1,y:0}
]

let turnCount = 0;

//First we find the start point
let position = {x : 0, y: 0}
let visited = [];

grid.forEach((row, y) => 
    row.forEach((square, x) => {
        if (square == '^'){
            position = {x,y};
            visited.push(position);
        }
    })
)

while (!outOfBounds(position)){
    const direction = directions[turnCount % 4]
    let newPosition = {
        x : position.x + direction.x,
        y : position.y + direction.y
    }
    if (outOfBounds(newPosition)){
        break;
    }
    if (grid[newPosition.y][newPosition.x] == '#'){
        turnCount++;
        continue;
    } else {
        position = newPosition;
        visited.push(position);
    }
}

//De dupe the visited list
export const uniqueVisited = visited.reduce((acc, square) => {
    if (!acc.some(({x,y}) => x == square.x && y == square.y)){
        acc.push(square);
    }
    return acc;
}, []);

console.log(uniqueVisited.length);

function outOfBounds({x,y}){
    return x < 0 || x >= grid[0].length || y < 0 || y >= grid.length;
}