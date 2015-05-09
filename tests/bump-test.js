'use strict';

var _         = require('lodash'),
    util      = require('util'),
    fs        = require('fs'),
    path      = require('path'),
    spawnSync = require('child_process').spawnSync,
    expect    = require('chai').expect;

module.exports = function bumpTest(args, initialJSON, finalJSON) {
  // Randomly choose a file to bump
  var fileName = _.sample(['package.json', 'bower.json', 'component.json']);
  var tmpPath = path.join(__dirname, '.tmp');
  var filePath = path.join(tmpPath, fileName);

  // Make sure the .tmp directory exists and is empty
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath)
  }
  else {
    fs.readdirSync(tmpPath).forEach(function(file) {
      fs.unlinkSync(path.join(tmpPath, file));
    });
  }

  // Initialize the file
  var data = initialJSON ? JSON.stringify(initialJSON, null, 2) : '';
  fs.writeFileSync(filePath, data);

  // Run bump
  var bump = path.resolve(__dirname, '..', 'bin', 'bump.js');
  args = [bump].concat(args.split(' '));
  var output = spawnSync('node', args, {cwd: tmpPath});

  // Check for errors
  if (output.error) {
    throw output.error;
  }
  else if (output.status) {
    throw new Error(util.format('Bump failed with error code %d.\n%s',
      output.status, output.stderr || output.stdout));
  }

  // Check the console output
  var stdout = output.stdout.toString();
  var expectedOutput = util.format('Updated %s to %s\n', fileName, finalJSON.version);
  expect(stdout).to.equal(expectedOutput);

  // Check the file contents
  var contents = fs.readFileSync(filePath, {encoding: 'utf8'});
  var json = JSON.parse(contents);
  expect(json).to.deep.equal(finalJSON);
};
