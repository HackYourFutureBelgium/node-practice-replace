const fs = require('fs');
const path = require('path');
module.exports = {
  name: __dirname.split('\\').pop(),
  args: [
    fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8'),
    "e",
    "*"
  ],
  expected: fs.readFileSync(path.join(__dirname, 'expected.txt'), 'utf-8')
};
