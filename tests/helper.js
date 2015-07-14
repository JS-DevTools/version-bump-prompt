'use strict';

module.exports.bump = bump;
module.exports.git = git;

var _         = require('lodash'),
    util      = require('util'),
    fs        = require('fs'),
    path      = require('path'),
    spawnSync = require('spawn-sync'),
    expect    = require('chai').expect;

/**
 * Runs bump with the given arguments, against the given JSON manifest.
 * Then verifies that the manifest is modified as expected.
 *
 * @param {string} args - The args to run bump with
 * @param {object} initialJSON - The initial contents of the manifest file
 * @param {object} finalJSON - The expected contents of the manifest file after bump runs
 */
function bump(args, initialJSON, finalJSON) {
  // Make sure the .tmp directory exists and is empty
  var tmpPath = path.join(__dirname, '.tmp');
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath)
  }
  else {
    fs.readdirSync(tmpPath).forEach(function(file) {
      fs.unlinkSync(path.join(tmpPath, file));
    });
  }

  // Initialize the manifest files
  var files = ['package.json', 'bower.json', 'component.json'];
  files.forEach(function(fileName) {
    var filePath = path.join(tmpPath, fileName);
    var data = initialJSON ? JSON.stringify(initialJSON, null, 2) : '';
    fs.writeFileSync(filePath, data);
  });

  // Modify the PATH environment variable so bump will execute our fake `git`
  var binPath = path.join(__dirname, 'bin');
  fs.chmodSync(path.join(binPath, 'git'), '0777');
  var env = _.clone(process.env);
  env.PATH = binPath + path.delimiter + env.PATH;

  // Run bump
  var bump = path.resolve(__dirname, '..', 'bin', 'bump.js');
  args = [bump].concat(args.split(' '));
  var output = spawnSync('node', args, {cwd: tmpPath, env: env});

  // Check for errors
  if (output.error) {
    throw output.error;
  }
  else if (output.status) {
    throw new Error(util.format('Bump failed with error code %d.\n%s',
      output.status, output.stderr || output.stdout));
  }

  var stdout = output.stdout.toString();
  files.forEach(function(fileName) {
    // Check the console output
    var expectedOutput = util.format('Updated %s to %s\n', fileName, finalJSON.version);
    if (_.isEmpty(finalJSON)) {
      expect(stdout).not.to.contain(expectedOutput);
    }
    else {
      expect(stdout).to.contain(expectedOutput);
    }

    // Check the file contents
    var filePath = path.join(tmpPath, fileName);
    var contents = fs.readFileSync(filePath, {encoding: 'utf8'});
    var json = JSON.parse(contents);
    expect(json).to.deep.equal(finalJSON);
  });
}

/**
 * Verifies that git was run with the expected arguments.
 *
 * @param {string[]} expected - An array of strings. Each string contains the arguments for a singlee git command.
 */
function git(expected) {
  var gitPath = path.join(__dirname, '.tmp', 'git.txt');
  var git = fs.readFileSync(gitPath, {encoding: 'utf8'});
  git = git.trim().split('\n');

  var length = Math.max(git.length, expected.length);
  for (var i = 0; i < length; i++) {
    expect(git[i]).to.equal(expected[i]);
  }
}