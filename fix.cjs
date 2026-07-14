const fs = require('fs');
const path = 'c:/Dev/Active/wave_vi_sgs/project/main.js';
let content = fs.readFileSync(path, 'utf8');
// Fix backticks
content = content.replace(/\\`/g, '`');
// Fix dollar braces
content = content.replace(/\\\$\{/g, '${');
fs.writeFileSync(path, content);
console.log('Fixed main.js');
