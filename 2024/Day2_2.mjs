import {readPuzzleInput} from './utils.mjs'

const contents = readPuzzleInput(2);
const testContents = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`

const underReview = contents;

const reports = underReview.trim().split("\n").map((line) => line.split(" "));

console.log(reports.filter((report) => checkReportWithDampner(report)).length);

function checkReportWithDampner(report) {
    const firstResult = checkReport(report);
    if (!firstResult){
        for (let i =0; i<report.length;i++){
            const dampenedReport = report.filter((_, index) => index != i);
            const dampenedResult = checkReport(dampenedReport);
            if (dampenedResult){
                return true;
            }
        }
    } else {
        return true;
    }
    return false;
}

function checkReport(report) {
    //Check direction, BUT, first interval could be 0 which is invalid
    const firstInterval = report[1] - report[0];
    if (firstInterval == 0){
        return false;
    }
    const ascending = firstInterval > 0;
    for (let i = 1; i<report.length; i++){
        const interval = report[i] - report[i-1];
        //Check the direction
        const direction = interval > 0;
        if (direction != ascending){
            return false;
        }

        //Check the interval
        if (Math.abs(interval) == 0 || Math.abs(interval) > 3){
            return false;
        }
    }
    return true;
}