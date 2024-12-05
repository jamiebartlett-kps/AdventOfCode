import fs from 'fs';

const fullInput = fs.readFileSync('./Input/Day5.txt', 'utf-8');
const testInput = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`

const underReview = fullInput.trim().split("\n");

const rules = underReview.filter(line => line.includes("|")).map((rule) => {
    const segments = rule.split("|");
    return {before : segments[0], after : segments[1]}
});
const printPages = underReview.filter(line => line.includes(",")).map((line) => line.split(","));

const validRows = printPages.filter((pages) => {
    for (let i=0;i<pages.length;i++){
        const page = pages[i];
        const pageRules = findRules(page);
        for (let rule of pageRules){
            const before = rule.before == page;
            const otherIndex = before ? pages.indexOf(rule.after) : pages.indexOf(rule.before);
            if (otherIndex != -1 && (before && otherIndex < i || !before && otherIndex > i)){
                return false;
            }
        }
    }
    return true;
});

const middles = validRows.map((row) => parseInt(row[Math.floor(row.length / 2)])); //Don't need to add one here because we index from 0, how handy!
const cumulativeMiddles = middles.reduce((acc, middle) => acc + middle, 0);

function findRules(page){
    return rules.filter(({before, after}) => before == page || after == page);
}

console.log(cumulativeMiddles);