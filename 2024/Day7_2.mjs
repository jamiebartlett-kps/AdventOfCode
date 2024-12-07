import fs from 'fs';

const fullInput = fs.readFileSync('./Input/Day7.txt', 'utf-8');
const testInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`

const underReview = fullInput;

const rules = underReview.trim().split("\n").map((line) => {
    const target = parseInt(line.split(":")[0]);
    const sequence = line.split(":")[1].trim().split(" ").map((i) => parseInt(i));
    return {target,sequence};
});

let validTally = 0;

rules.forEach(({target, sequence}) => {
    const iterations = 3 ** (sequence.length - 1);
    for (let iteration =0; iteration < iterations; iteration++){
        const binary = iteration.toString(3).padStart(sequence.length - 1, '0');
        
        let tally = sequence[0];
        for (let operatorPos = 0; operatorPos < binary.length; operatorPos++){
            const operator = binary.charAt(operatorPos);
            const number = sequence[operatorPos+1];

            if (operator == 0){
                tally += number;
            } else if (operator == 1) {
                tally *= number;
            } else {
                tally = parseInt(`${tally}${number}`);
            }
        }
        if (tally == target){
            validTally += target;
            return;
        }
    }
});

console.log(validTally);