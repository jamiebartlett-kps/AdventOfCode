import { readPuzzleInput } from "../utils.mjs";

const fullInput = readPuzzleInput(14);
const testInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`

const underReview = fullInput;

const seconds = 100;
const axisArr = ['x','y'];
const limits = {
    x: 101,
    y: 103
}

const robots = underReview.trim().split("\n").map((line) => {
    const [_,px,py,vx,vy] = line.match(/p\=([0-9]+),([0-9]+) v=(\-?[0-9]+),(\-?[0-9]+)/);
    return {
        position : {
            x : parseInt(px),
            y : parseInt(py)
        },
        direction : {
            x : parseInt(vx),
            y : parseInt(vy)
        }
    }
});

function robotTick(robot) {
    for (const axis of axisArr){
        robot.position[axis] += robot.direction[axis];

        if (robot.position[axis] < 0){
            robot.position[axis] = limits[axis] + robot.position[axis];
        } else if (robot.position[axis] >= limits[axis]){
            const diff = robot.position[axis] - limits[axis];
            robot.position[axis] = diff;
        }
    }
}

for (let i=1;i<=seconds;i++){
    robots.forEach((robot) => robotTick(robot));
}

const quadrantRobots = robots.reduce((acc, {position}) => {
    let x;
    let y;

    if (position.x < Math.floor(limits.x / 2)){
        x = "left";
    } else if (position.x >= Math.ceil(limits.x / 2)){
        x = "right"
    } else {
        return acc;
    }

    if (position.y < Math.floor(limits.y / 2)){
        y = "top";
    } else if (position.y >= Math.ceil(limits.y / 2)){
        y = "bottom";
    } else {
        return acc;
    }

    const quad = `${y}${x}`;
    if (!acc[quad]){
        acc[quad] = []
    }
    acc[quad].push(position);
    return acc;
},{});

const safetyScore = Object.keys(quadrantRobots).reduce((acc, key) => acc *= quadrantRobots[key].length, 1);

console.log(safetyScore);