const replace = require('../logic/index.js');
const fs = require('fs');
const path = require('path');

const tests = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(dir => require(__dirname + '/' + dir.name));

const testResults = tests.map(test => {
  try {
    test.actual = replace(...test.args);
  } catch (err) {
    console.error(err);
    test.error = err;
    return test;
  }
  if (typeof test.actual !== 'string') {
    console.log('replace did not return a sting');
    return test;
  }
  test.pass = test.actual === test.expected;
  fs.writeFileSync(
    path.join(__dirname, test.name, 'actual.txt'),
    test.actual,
    'utf-8'
  );
  return test;
});

const report = {
  evaluated: new Date().toLocaleString(),
  stats: testResults.reduce((stats, test) => {
    stats[test.name] = test.pass ? 'pass' : 'fail';
    return stats;
  }, {}),
  tests: testResults,
};

console.log(JSON.stringify(report.stats, null, '  '));

fs.writeFileSync(
  __dirname + '/report.json',
  JSON.stringify(report, null, '  ')
);
