import { join } from 'path';

const [year, day, part] = process.argv.slice(-3);
const fileName = `./${year}/Day${day}_${part}.mjs`;

import(fileName);