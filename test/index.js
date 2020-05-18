const replace = require('../logic/index.js');
const fs = require('fs');
const path = require('path');

const tests = fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(dir => require(path.join(__dirname, dir.name)));

const testResults = tests
  .map(test => {
    test.actual = replace(...test.args);
    //console.log(test);
    if (test.name == '4--four')
      test.pass = test.actual.localeCompare(test.expected);
    else
      test.pass = test.actual === test.expected;
    fs.writeFileSync(path.join(__dirname, test.name, 'actual.txt'), test.actual);
    return test;
  });

const report = {
  evaluated: (new Date()).toLocaleString(),
  stats: testResults.reduce((stats, test) => {
    stats[test.name] = test.pass ? 'pass' : 'fail';
    return stats
  }, {}),
  tests: testResults
};

console.log(JSON.stringify(report.stats, null, '  '));

fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, '  '));


