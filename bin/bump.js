#!/usr/bin/env node
'use strict';

var program   = require('commander'),
    inquirer  = require('inquirer'),
    api       = require('../lib/index');

program
  .version(require('../package').version)
  .usage('[options]');

['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease']
  .forEach(function(type) {
    program.option('--' + type, 'Increase ' + type + ' version');

    program.on(type, function() {
      setTimeout(function() {
        api.manifests().forEach(function(manifest) {
          api.bump(manifest, type, program.preid);
        });

        doGit();
      }, 0);
    });
  });

program
  .option('--prompt', 'Prompt for type of bump (patch, minor, major, premajor, prerelase, etc.)')
  .option('--preid [name]', 'The identifier for prerelease versions (default is "beta")')
  .option('--commit', 'Commit changed files to Git')
  .option('--tag', 'Tag the commit in Git')
  .option('--push', 'Push the Git commit')
  .option('--all', 'Commit/tag/push all pending files, not just the ones changed by bump');

program.on('prompt', function() {
  var manifests = api.manifests();
  var i = 0;

  bumpNextManifest();

  function bumpNextManifest() {
    if (i < manifests.length) {
      var manifest = manifests[i++];
      var version = api.versionInfo(manifest, program.preid);

      console.log('\nCurrent version in %s is %s', manifest, version.current);
      inquirer.prompt({
          type: 'list',
          name: 'bump',
          message: 'How would you like to bump it?',
          default: 'patch',
          choices: [
            {value: 'major', name: 'major (' + version.nextMajor + ')'},
            {value: 'minor', name: 'minor (' + version.nextMinor + ')'},
            {value: 'patch', name: 'patch (' + version.nextPatch + ')'},
            {value: 'premajor', name: 'pre-release major (' + version.nextPreMajor + ')'},
            {value: 'preminor', name: 'pre-release minor (' + version.nextPreMinor + ')'},
            {value: 'prepatch', name: 'pre-relase patch (' + version.nextPrePatch + ')'},
            {value: 'prerelease', name: 'pre-release (' + version.nextPreRelease + ')'}
          ]
        },
        function(answer) {
          api.bump(manifest, answer.bump, program.preid);
          bumpNextManifest();
        }
      );
    }
    else {
      doGit();
    }
  }

});

program.on('--help', function() {
  console.log('  Usage:\n');
  console.log('    $ bump --patch');
  console.log('    $ bump --major --tag');
  console.log('    $ bump --prompt --tag --push --all');
});

program.parse(process.argv);

if (program.rawArgs.length < 3) {
  program.help();
}

function doGit() {
  if (program.commit || program.tag || program.push) {
    api.commit(program.all, program.tag, program.push);
  }
}

