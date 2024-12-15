import { readPuzzleInput, calculateNewPos, createGrid, outOfBounds } from '../utils.mjs'

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

const underReview = testInput;
let [grid,moves] = underReview.split("\n\n")
const directions = {
    '<' : {x:-1,y:0},
    '>' : {x:1,y:0},
    'v' : {x:0,y:1},
    '^' : {x:0,y:-1}
}

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
    let moved = false;
    const newPos = calculateNewPos(pos, direction);
    if (!outOfBounds(newPos, grid)){
        const newSquare = grid[newPos.x][newPos.y];
        if (newSquare == '.'){
            grid[newPos.x][newPos.y] = obj;
            grid[pos.x][pos.y] = '.';
            moved = true;
        } else if (newSquare == 'O'){
            moved = moveObject('O', newPos, direction);
            if (moved){
                grid[newPos.x][newPos.y] = obj;
                grid[pos.x][pos.y] = '.';
            }
        }
    }
    return moved;
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
        if (square == 'O'){
            const value = (y * 100) + x;
            tally += value;
        }
    });
})

console.log(tally);