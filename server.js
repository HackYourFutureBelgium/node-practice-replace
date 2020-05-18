const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const replace = require('./logic');
const util = require('util');

// some helper functions you can use
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const deleteFile = util.promisify(fs.unlink);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILES_DIR = path.join(__dirname, 'files');
app.get('/', (req, res) => {
    res.send('root ... ');
});
// GET: '/files'
// response: {status: 'ok', files: ['all.txt','file.txt','names.txt']}
app.get('/files', async (req, res, next) => {
    try {
        console.log(FILES_DIR);
        const listFiles = await readDir(FILES_DIR);
        console.log(listFiles);
        res.status(200).send({ status: 'ok', files: listFiles });
    } catch (err) {
        next(err);
        return;
    }
});
// POST: '/files/add/:name'
//  body: {text: "file contents"}
//  write a new files into ./files with the given name and contents
// redirect -> GET: '/files'
app.get('/files/add/:name', async (req, res, next) => {
    try {

        let fileName = req.params.name;
        await writeFile(path.join(FILES_DIR, fileName + '.txt'), req.body.text, 'utf-8');
        res.redirect('/files');
    } catch (err) {
        next(err);
        return;
    }
});
// PUT: '/files/replace/:oldFile/:newFile'
//  body: {toReplace: "str to replace", withThis: "replacement string"}
//  route logic:
//    read the old file
//    use the replace function to create the new text
//    write the new text to the new file name
//  note - params should not include .txt, you should add that in the route logic
// failure: {status: '404', message: `no file named ${oldFile}`  }
// success: redirect -> GET: '/files'
app.post('/files/replace/:oldFile/:newFile', async (req, res) => {
    try {

        let oldFileName = req.params.oldFile;
        let newFileName = req.params.newFile;
        const oldFileContent = await readFile(path.join(FILES_DIR, oldFileName + '.txt'), 'utf-8');
        const newText = replace(oldFileContent, req.body.toReplace, req.body.withThis);
        await writeFile(path.join(FILES_DIR, newFileName + '.txt'), newText, 'utf-8');
        res.redirect('/files');
    } catch (err) {
        res.send({ status: '404', message: `no file named ${oldFileName}` });
        return;
    }
});
// GET: '/report'
//  reads the contents from ./test/report.json and sends it
// response: {status: 'ok', report }
app.get('/report', async (req, res, next) => {
    try {


        const report = await readFile(path.join(__dirname, 'test/report.json'), 'utf-8');
        res.send({ status: 'ok', report });
    } catch (err) {
        next(err);
        return;
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Replacer is serving at http://localhost:${port}`));
