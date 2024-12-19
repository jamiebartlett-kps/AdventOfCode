import { readPuzzleInput } from "../utils.mjs";

const fullInput = readPuzzleInput(17);
const testInput = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`

const underReview = fullInput;

const registers = {
    a: underReview.match(/Register A: ([0-9]+)/)[1],
    b: underReview.match(/Register B: ([0-9]+)/)[1],
    c: underReview.match(/Register C: ([0-9]+)/)[1]
}

const program = underReview.match(/Program: ([0-9,]+)/)[1].split(",").map(Number);

function getComboOperand(op){
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

function adv(op){
    executedOpcodes.push("adv");
    const combo = getComboOperand(op);
    const numerator = registers.a;
    const denominator = 2**combo;
    registers.a = Math.trunc(numerator / denominator);
    instructionPointer += 2;
}

function bxl(op){
    executedOpcodes.push("bxl");
    registers.b = (registers.b ^ op) >>> 0;
    instructionPointer += 2;
}

function bst(op){
    executedOpcodes.push("bst");
    registers.b = getComboOperand(op) % 8;
    instructionPointer += 2;
}

function jnz(op){
    executedOpcodes.push("jnz");
    if (registers.a == 0 || op == instructionPointer){
        instructionPointer += 2;
    } else {
        instructionPointer = op;
    }
}

function bxc(op){
    executedOpcodes.push("bxc");
    registers.b = (registers.c ^ registers.b) >>> 0;
    instructionPointer += 2;
}

function out(op){
    executedOpcodes.push("out");
    const combo = getComboOperand(op);
    outputs.push(combo % 8);
    instructionPointer += 2;
}

function bdv(op){
    executedOpcodes.push("bdv");
    const combo = getComboOperand(op);
    const numerator = registers.a;
    const denominator = 2**combo;
    registers.b = Math.trunc(numerator / denominator);
    instructionPointer += 2;
}

function cdv(op){
    executedOpcodes.push("cdv");
    const combo = getComboOperand(op);
    const numerator = registers.a;
    const denominator = 2**combo;
    registers.c = Math.trunc(numerator / denominator);
    instructionPointer += 2;
}

const opcodes = [adv, bxl, bst, jnz, bxc, out, bdv, cdv]

const outputs = []
let instructionPointer = 0;

let executedOpcodes = [];

while (instructionPointer < program.length){
    const opcode = opcodes[program[instructionPointer]];
    const operand = program[instructionPointer+1];
    opcode(operand);
}

executedOpcodes = [...new Set(executedOpcodes)];
console.log(executedOpcodes);
console.log(outputs.join(","));
console.log(program.join(","));