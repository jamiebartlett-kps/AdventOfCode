import {uniqueVisited} from './Day6_1.mjs';
import { directions, readPuzzleInput, outOfBounds, createGrid } from '../utils.mjs';

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

function isInfiniteLoop(grid, newObstacle){
    console.log(`Checking ${newObstacle.x} ${newObstacle.y}`);
    return new Promise((resolve) => {
        let obstaclesVisited = [];
        let turnCount = 0;
        let position = findStart(grid);
    
        while (!outOfBounds(position, grid)){
            const direction = directions[turnCount % 4]
            let newPosition = {
                x : position.x + direction.x,
                y : position.y + direction.y
            }
            if (outOfBounds(newPosition, grid)){
                break;
            }
            if ((newObstacle.x == newPosition.x && newObstacle.y == newPosition.y) || grid[newPosition.x][newPosition.y] == '#'){
                const obstacleVisit = {
                    direction,
                    x: newPosition.x,
                    y: newPosition.y
                }
                const visitedBefore = obstaclesVisited.some((visit) => {
                    return (visit.direction.x == direction.x && visit.direction.y == direction.y && visit.x == obstacleVisit.x && visit.y == obstacleVisit.y)
                });
                if (visitedBefore){
                    resolve(true);
                    return
                } else {
                    obstaclesVisited.push(obstacleVisit);
                }
                turnCount++;
                continue;
            } else {
                position = newPosition;
            }
        }
        resolve(false);
    });
}


let promises = [];
const grid = createGrid(underReview);
uniqueVisited.forEach(({x,y}) => {
    const square = grid[x][y];
    if (square != '#' && square != '^'){
        promises.push(isInfiniteLoop(grid, {x,y}));
    }
});

Promise.all(promises).then((results) => {
    const loopPositions = results.filter((loop) => loop);
    console.log(loopPositions.length);
})

function findStart(grid){
    let start = {};
    grid.forEach((col, x) => 
        col.forEach((square, y) => {
            if (square == '^'){
                start = {x,y};
            }
        })
    )
    return start;
}