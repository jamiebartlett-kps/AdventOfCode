import fs from 'fs';

export const readPuzzleInput = (day) => fs.readFileSync(`./Input/Day${day}.txt`, 'utf-8');

export function createGrid(str, operator = (a) => a){
    const rotated = str.trim().split("\n").map((a) => a.split(""));
    return rotated[0].map((_, x) => rotated.map(row => operator(row[x])))
}

export const directions = [
    {x:0,y:-1},
    {x:1,y:0},
    {x:0,y:1},
    {x:-1,y:0}
]

export function outOfBounds(pos, grid){
    return (pos.x < 0 || pos.y < 0 || pos.x >= grid.length || pos.y >= grid[0].length);
}

export function dedupe(arr){
    return arr.reduce((acc, item) => {
        const toAdd = !acc.some((i) => {
            for (let key of Object.keys(item)){
                if (i[key] != item[key]){
                    return false
                }
            }
            return true;
        });
        if (toAdd){
            acc.push(item);
        }
        return acc;
    }, []);
}