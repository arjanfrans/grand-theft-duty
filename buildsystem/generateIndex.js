'use strict';

let fs = require('fs');
let path = require('path');

let npmPath = path.resolve(__dirname + '/../package.json');
let npmPackage = JSON.parse(fs.readFileSync(npmPath));

let nunjucks = require('nunjucks');

let output = nunjucks.render(__dirname + '/index-template.html', {
    version: npmPackage.version,
    year: new Date().getFullYear()
});

fs.writeFileSync(path.resolve(__dirname + '/../index.html'), output);
