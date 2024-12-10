import { join } from 'path';

const [day, part] = process.argv.slice(2);
const fileName = `./Day${day}_${part}.mjs`;

import(fileName);