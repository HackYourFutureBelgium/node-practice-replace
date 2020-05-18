/* write a CLI interface for the "replace" function and your files

  command line arguments:
    1: the file you want to read from
    2: the old string to replace
    3: the new string to replace it with
    4: the file you want to write to

  examples:
  $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
  $ node cli.js the-library-of-babel.txt f g library-f-g.txt

  behavior:
  : parse command line arguments from process.argv
    (let the user know if they are missing any arguments!)
  : read from the selected file in the './files' directory
  : use your logic function to create the new text
  : write to the new file
  : console.log a nice message letting the user know what happened

  little challenges:
  : -help
    if a user passes in "-help" as any command line argument,
    log a little description of how the CLI works
  : -list
    if a user passes in "-list" as any command line argument,
    log a list of all the file names in "./files"

*/
// require dependencies
const fs = require('fs');
const path = require('path');
const yargs = require('yargs'); //`npm i yargs` -- > update package.json + node_module
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const replace = require('./logic');
// declare constants
const FILES_DIR = path.join(__dirname, 'files');

const argv = yargs
  .command('replace', 'replace old string in first file with new string in the second file ex: node cli.js replace -f param.txt -s testing.txt -o 123 -n 456',
    {
      firstFile: {
        description: 'first file ',
        alias: 'f',
        type: 'string',
      }, oldString: {
        description: 'old string ',
        alias: 'o',
        type: 'string',
      }, newString: {
        description: 'new string ',
        alias: 'n',
        type: 'string',
      }, secondFile: {
        description: 'the new replaced file with new data',
        alias: 's',
        type: 'string',
      }
    })
  .command('all', 'list all files in the directory..')
  .help()
  .alias('help', 'h')
  .argv;


if (argv._.includes('all')) {
  console.log('reading all enteries ...');
  readDir(FILES_DIR, 'utf-8')
    .then((contents) => {
      console.log(contents);
      process.exit(0);
    }).catch((err) => { if (err) throw err; });
}

// ex node cli.js replace -f param.txt -s testing.txt -o 123 -n 456
if (argv._.includes('replace')) {
  if (argv.firstFile === undefined) {
    console.log(argv);
    console.log("A file to copy from is needed");
    process.exit(0);
  }
  if (argv.oldString === undefined) {
    console.log("An old string is needed");
    process.exit(0);
  }
  if (argv.secondFile === undefined) {
    console.log("A second file is needed");
    process.exit(0);
  }
  if (argv.newString === undefined) {
    console.log("A new string is needed");
    process.exit(0);
  }
  console.log('Staring the copy process ...');
  console.log('starting ..')
  let oldFileName = argv.firstFile;
  let newFileName = argv.secondFile;
  let oldString = argv.oldString;
  let newString = argv.newString;
  readFile(path.join(FILES_DIR, oldFileName), 'utf-8')
    .then((oldFileContent) => {
      const newText = replace(oldFileContent, oldString, newString);
      writeFile(path.join(FILES_DIR, newFileName), newText, 'utf-8')
        .then(() => {
          console.log(`the file ${oldFileName} has replace this old string ${oldString} with this new string ${newString} and updated text is written to this new file ${newFileName} `)
        }).catch((err) => {
          console.log('Error has happened ' + err.message);
          return;
        });
    }).catch((err) => {
      console.log('Error has happened ' + err.message);
      return;
    });

}


