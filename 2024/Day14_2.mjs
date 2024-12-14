import { readPuzzleInput } from "../utils.mjs";
import readline from 'readline';

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

async function runTicks() {
    let seconds = 1;
    while(true){
        robots.forEach((robot) => robotTick(robot));
        if (potentialTree(robots)){
            console.log(`${seconds} Seconds`);
            drawPositions(robots);
            await pauseForInput();
        }
        seconds++;
    }
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

function drawPositions(robots){
    for (let y=0;y<limits.y;y++){
        let row = '';
        for (let x=0;x<limits.x;x++){
            const onSpot = robots.filter(({position}) => position.x == x && position.y == y);
            row += onSpot.length == 0 ? '.' : onSpot.length;
        }
        console.log(row);
    }
}

const safetyScore = Object.keys(quadrantRobots).reduce((acc, key) => acc *= quadrantRobots[key].length, 1);

function potentialTree(robots){
    //Let's look for long horizontal lines
    for (let y=0;y<limits.y;y++){
        //Get all robots on this row
        const robotsOnRow = robots.filter(({position}) => position.y == y);
        let columns = robotsOnRow.map(({position}) => position.x);
        columns = [...new Set(columns)];
        columns.sort((a,b) => a-b);

        let lines = columns.reduce((acc, x, index, arr) => {
            if (index === 0 || x - arr[index - 1] > 1) {
                acc.push([]);
            }
            acc[acc.length - 1].push(x); 
            return acc;
        }, []);

        const longLine = lines.some(line => line.length > 10);
        if (longLine){
            return true;
        }
    }
    return false;
}

async function pauseForInput() {
    const input = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        input.question('Is this a tree?', () => {
            input.close();
            resolve();
        });
    });
}

runTicks();