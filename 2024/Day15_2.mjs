import { readPuzzleInput, calculateNewPos, createGrid, outOfBounds, dedupe } from '../utils.mjs'

const fullInput = readPuzzleInput(15);
const testInput = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`

const tinyInput = `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<<^`

const underReview = fullInput;
let [originalGrid,moves] = underReview.split("\n\n")
const directions = {
    '<' : {x:-1,y:0},
    '>' : {x:1,y:0},
    'v' : {x:0,y:1},
    '^' : {x:0,y:-1}
}

//Widen the grid
let grid = "";
originalGrid.split("\n").forEach((line) => {
    let gridLine = "";
    line.split("").forEach((square) => {
        switch (square){
            case "#":
                gridLine += "##"
                break;
            case "O":
                gridLine += "[]"
                break;
            default:
                gridLine += `${square}.`
                break;    
        }
    });
    grid += `${gridLine}\n`;
})

grid = createGrid(grid);

moves = moves.split("\n").map((line) => line.split("")).flat();

let robotPos;
updateRobotPos();

moves.forEach((move) => {
    const direction = directions[move];
    moveObject('@',robotPos,direction);
    updateRobotPos();
});

function moveObject(obj, pos, direction){
    if (Math.abs(direction.x) > 0){
        return simpleMoveObject(obj, pos, direction);
    } else {
        return moveObjectY(obj, pos, direction);
    }
}

function simpleMoveObject(obj,pos,direction){
    let moved = false;
    const newPos = calculateNewPos(pos, direction);
    if (!outOfBounds(newPos, grid)){
        const newSquare = grid[newPos.x][newPos.y];
        if (newSquare == '.'){
            grid[newPos.x][newPos.y] = obj;
            grid[pos.x][pos.y] = '.';
            moved = true;
        } else if (newSquare == '[' || newSquare == ']'){
            moved = moveObject(newSquare.toString(), newPos, direction);
            if (moved){
                grid[newPos.x][newPos.y] = obj;
                grid[pos.x][pos.y] = '.';
            }
        }
    }
    return moved;
}

function moveObjectY(obj,pos,direction){
    const newPos = calculateNewPos(pos, direction);
    if (!outOfBounds(newPos, grid)){
        const newSquare = grid[newPos.x][newPos.y];
        if (obj == '@' && newSquare == '.'){
            return simpleMoveObject(obj, pos, direction);
        } else if (newSquare == '[' || newSquare == ']'){
            //Recursively find all the objects it will touch
            const moveAll = findPushingSquares(pos, direction, []);
            if (moveAll){
                //If we're pushing up, we need to move the smallest Ys first
                if (direction.y < 0){
                    moveAll.sort((a,b) => a.y-b.y);
                //If we're pushing down, we need to move the biggest Ys fiest
                } else {
                    moveAll.sort((a,b) => b.y-a.y);
                }
                moveAll.forEach((movePos) => {
                    const square = grid[movePos.x][movePos.y];
                    const moveNewPos = calculateNewPos(movePos, direction);
                    grid[moveNewPos.x][moveNewPos.y] = square;
                    grid[movePos.x][movePos.y] = '.';
                })
            } else {
                return false;
            }
        }
    }
    return false;
}

function findPushingSquares(pos, direction, pushingSquares){
    pushingSquares.push(pos);
    const newPos = calculateNewPos(pos, direction);
    if (!outOfBounds(newPos, grid)){
        const newSquare = grid[newPos.x][newPos.y];
        if (newSquare == '['){
            const sibling = {...newPos, x:newPos.x+1};
            const myNewSquares = findPushingSquares(newPos, direction, pushingSquares);
            const siblingNewSquares = findPushingSquares(sibling, direction, pushingSquares);
            if (myNewSquares == false || siblingNewSquares == false) {
                return false;
            }
            return dedupe([...pushingSquares, ...myNewSquares, ...siblingNewSquares]);
        } else if (newSquare == ']'){
            const sibling = {...newPos, x:newPos.x-1};
            const myNewSquares = findPushingSquares(newPos, direction, pushingSquares);
            const siblingNewSquares = findPushingSquares(sibling, direction, pushingSquares);
            if (myNewSquares == false || siblingNewSquares == false) {
                return false;
            }
            return dedupe([...pushingSquares, ...myNewSquares, ...siblingNewSquares]);
        } else if (newSquare == '#'){
            return false;
        } else {
            return dedupe(pushingSquares);
        }
    }
    return false;
}

function drawGrid() {
    for (let y = 0; y < grid[0].length; y++) {
        let row = '';
        for (let x = 0; x < grid.length; x++) {
            row += grid[x][y];
        }
        console.log(row);
    }
}

function updateRobotPos(){
    grid.forEach((col,x) => {
        col.forEach((square,y) => {
            if (square == '@') robotPos = {x,y}
        })
    });
}

let tally = 0;
grid.forEach((col, x) => {
    col.forEach((square, y) => {
        if (square == '['){
            const value = (y * 100) + x;
            tally += value;
        }
    });
});

drawGrid();

console.log(tally);