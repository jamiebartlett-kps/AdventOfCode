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

const directions = [
    {x:0,y:-1},
    {x:1,y:0},
    {x:0,y:1},
    {x:-1,y:0}
]

function isInfiniteLoop(grid, newObstacle){
    console.log(`Checking ${newObstacle.x} ${newObstacle.y}`);
    return new Promise((resolve) => {
        let turnCount = 0;
        let position = findStart(grid);
    
        let visited = [position];
        let squaresSinceNew = 0;
    
        while (!outOfBounds(position)){
            const direction = directions[turnCount % 4]
            let newPosition = {
                x : position.x + direction.x,
                y : position.y + direction.y
            }
            if (outOfBounds(newPosition)){
                break;
            }
            if ((newObstacle.x == newPosition.x && newObstacle.y == newPosition.y) || grid[newPosition.y][newPosition.x] == '#'){
                turnCount++;
                continue;
            } else {
                position = newPosition;
                
                const beenHereBefore = visited.some(({x,y}) => x == position.x && y == position.y);
                if (!beenHereBefore){
                    visited.push(position);
                    squaresSinceNew = 0;
                } else {
                    squaresSinceNew++;
                }
    
                //If there's been more than the total number of squares since we last saw a unique square, we're in a loop
                if (squaresSinceNew > (grid.length * grid[0].length)){
                    resolve(true);
                    return;
                }
            }
        }
        resolve(false);
    });
}


let promises = [];
const grid = underReview.trim().split("\n").map((line) => line.split(""));
grid.forEach((row, y) => {
    row.forEach((square, x) => {
        if (square != '#' && square != '^'){
            promises.push(isInfiniteLoop(grid, {x,y}));
        }
    });
})

Promise.all(promises).then((results) => {
    const loopPositions = results.filter((loop) => loop);
    console.log(loopPositions.length);
})

function outOfBounds({x,y}){
    return x < 0 || x >= grid[0].length || y < 0 || y >= grid.length;
}

function findStart(grid){
    let start = {};
    grid.forEach((row, y) => 
        row.forEach((square, x) => {
            if (square == '^'){
                start = {x,y};
            }
        })
    )
    return start;
}