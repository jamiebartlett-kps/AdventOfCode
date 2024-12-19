import request from 'sync-request';
import dotenv from 'dotenv';

dotenv.config();

export const readPuzzleInput = (day, year = "2024") => {
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    const headers = {
      'Cookie' : `session=${process.env.SESSION_ID}`
    };
  
    const res = request('GET', url, { headers });
    return res.getBody('utf-8');
  };

export function createGrid(str, operator = (a) => a){
    const rotated = str.trim().split("\n").map((a) => a.split(""));
    return rotated[0].map((_, x) => rotated.map(row => operator(row[x])))
}

export const directions = [
    {x:0,y:-1, dir:"up"},
    {x:1,y:0, dir:"right"},
    {x:0,y:1, dir:"down"},
    {x:-1,y:0, dir:"left"}
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

export const wordMap = {
    "one" : 1,
    "two" : 2,
    "three" : 3,
    "four" : 4,
    "five" : 5,
    "six" : 6,
    "seven" : 7,
    "eight" : 8,
    "nine" : 9
}

export function calculateNewPos(pos, direction){
    return {x:pos.x + direction.x, y:pos.y + direction.y};
}

export function getLastElement(arr){
    return arr[arr.length - 1];
}

export function findInGrid(obj, grid){
    for (let x=0;x<grid.length;x++){
        const col = grid[x];
        for (let y=0;y<col.length;y++){
            if (col[y] == obj) return {x,y};
        }
    }
}

export function arraysEqual(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    return arr1.every((value, index) => value == arr2[index]);
}