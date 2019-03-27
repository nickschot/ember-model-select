'use strict';

const sass = require('sass'); // eslint-disable-line node/no-unpublished-require
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'app', 'styles', 'ember-model-select.scss');
const outputFile = path.join(__dirname, 'vendor', 'ember-model-select.css');

// Compile main file
var result = sass.renderSync({
  data: fs.readFileSync(inputFile, "utf8"),
  includePaths: ['app/styles', 'node_modules/ember-power-select/app/styles']
});

fs.writeFileSync(outputFile, result.css);
