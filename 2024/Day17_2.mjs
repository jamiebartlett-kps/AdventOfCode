import { readPuzzleInput } from "../utils.mjs";

const fullInput = readPuzzleInput(17);
const testInput = `
Register A: 0
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`

const underReview = fullInput;

const initialRegisters = {
    b: underReview.match(/Register B: ([0-9]+)/)[1],
    c: underReview.match(/Register C: ([0-9]+)/)[1]
}

const program = underReview.match(/Program: ([0-9,]+)/)[1].split(",").map(Number);

function getComboOperand(op, registers){
    if (op <= 3){
        return op
    } else if (op == 4){
        return registers.a;
    } else if (op == 5){
        return registers.b;
    } else if (op == 6){
        return registers.c;
    }
}

function adv(op, registers, instructionPointer, outputs){
    const combo = getComboOperand(op, registers);
    const numerator = registers.a;
    const denominator = 2**combo;
    registers.a = Math.trunc(numerator / denominator);
    instructionPointer += 2;
    return instructionPointer;
}

function bxl(op, registers, instructionPointer, outputs){
    registers.b = (registers.b ^ op)  >>> 0;
    instructionPointer += 2;
    return instructionPointer;
}

function bst(op, registers, instructionPointer, outputs){
    registers.b = getComboOperand(op, registers) % 8;
    instructionPointer += 2;
    return instructionPointer;
}

function jnz(op, registers, instructionPointer, outputs){
    if (registers.a == 0 || op == instructionPointer){
        instructionPointer += 2;
    } else {
        instructionPointer = op;
    }
    return instructionPointer;
}

function bxc(op, registers, instructionPointer, outputs){
    registers.b = (registers.c ^ registers.b)  >>> 0;
    instructionPointer += 2;
    return instructionPointer;
}

function out(op, registers, instructionPointer, outputs){
    const combo = getComboOperand(op, registers);
    outputs.push(combo % 8);
    instructionPointer += 2;
    return instructionPointer;
}

function bdv(op, registers, instructionPointer, outputs){
    const combo = getComboOperand(op, registers);
    const numerator = registers.a;
    const denominator = 2**combo;
    registers.b = Math.trunc(numerator / denominator);
    instructionPointer += 2;
    return instructionPointer;
}

function cdv(op, registers, instructionPointer, outputs){
    const combo = getComboOperand(op, registers);
    const numerator = registers.a;
    const denominator = 2**combo;
    registers.c = Math.trunc(numerator / denominator);
    instructionPointer += 2;
    return instructionPointer;
}

const opcodes = [adv, bxl, bst, jnz, bxc, out, bdv, cdv]

function runProgram(a){
    const registers = {
        ...initialRegisters,
        a
    }

    let instructionPointer = 0;
    let outputs = [];

    while(instructionPointer < program.length){
        const opcode = opcodes[program[instructionPointer]];
        const operand = program[instructionPointer+1];
        instructionPointer = opcode(operand, registers, instructionPointer, outputs);
    }

    return outputs;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    return arr1.every((value, index) => value == arr2[index]);
}

function compareLastNDigits(arr1, arr2, length){
    const tail1 = arr1.slice(arr1.length - length, arr1.length);
    const tail2 = arr2.slice(arr2.length - length, arr2.length);
    return arraysEqual(tail1, tail2);
}

let a=1;
let foundDigits=1;

while(foundDigits < program.length){
    const output = runProgram(a);
    if (compareLastNDigits(output, program, foundDigits)){
        a = a*8; //Shift by an octet because we're looking at the next digit back
        foundDigits++;
        continue;
    }
    a +=1;
}

console.log(a);