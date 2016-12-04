#!/usr/bin/env node
'use strict';

var program  = require('commander'),
    inquirer = require('inquirer'),
    chalk    = require('chalk'),
    Promise  = require('es6-promise').Promise,
    api      = require('../');

program
  .version(require('../package').version)
  .option('--major', 'Increase major version')
  .option('--minor', 'Increase minor version')
  .option('--patch', 'Increase patch version')
  .option('--premajor', 'Increase major version, pre-release')
  .option('--preminor', 'Increase preminor version, pre-release')
  .option('--prepatch', 'Increase prepatch version, pre-release')
  .option('--prerelease', 'Increase prerelease version')
  .option('--prompt', 'Prompt for type of bump (patch, minor, major, premajor, prerelase, etc.)')
  .option('--preid <name>', 'The identifier for prerelease versions (default is "beta")')
  .option('--commit [message]', 'Commit changed files to Git (default message is "release vX.X.X")')
  .option('--tag', 'Tag the commit in Git')
  .option('--push', 'Push the Git commit')
  .option('--all', 'Commit/tag/push ALL pending files, not just the ones changed by bump')
  .option('--grep <filespec...>', 'Files and/or globs to do a text-replace of the old version number with the new one')
  .on('--help', function() {
    console.log(
      '  Examples:\n' +
      '\n' +
      '    $ bump --patch\n' +
      '    $ bump --major --tag\n' +
      '    $ bump --patch --tag --all --grep README.md\n' +
      '    $ bump --prompt --tag --push --all\n'
    );
  })
  .parse(process.argv);

// Show help if no options were given
if (program.rawArgs.length < 3) {
  program.help();
}
else {
  var options = program;

  if (options.grep && program.args) {
    // If multiple --grep files are specified, then they are parsed as separate args
    options.grep = program.args.concat(options.grep);
  }

  if (typeof options.commit === 'string') {
    options.commitMessage = options.commit;
    options.commit = true;
  }

  var manifests = api.manifests();
  bumpManifests(manifests, options)
    .then(function() {
      api.grep(manifests, options);
      manifests.forEach(function (manifest) {
        api.runNpmScriptIfExists(manifest, 'version');
      });
    })
    .then(function() {
      api.git(manifests, options);
    })
    .catch(function(err) {
      console.error(chalk.red(err.message));
      process.exit(err.status || 1);
    });
}

/**
 * Bumps each manifest sequentially
 *
 * @param {string[]} manifests - An array of manifest files to bump
 * @param {object} options - CLI options
 * @returns {Promise}
 */
function bumpManifests(manifests, options) {
  var i = 0;

  return bumpNext('patch');

  function bumpNext(defaultBumpType) {
    var manifest = manifests[i++];
    if (manifest) {
      return bumpManifest(manifest, defaultBumpType, options).then(bumpNext);
    }
    else {
      return Promise.resolve(defaultBumpType);
    }
  }
}

/**
 * Bumps the given manifest
 *
 * @param {string} manifest - The manifest name (e.g. "package.json", "bower.json", etc.)
 * @param {string} defaultBumpType - The default type of bump to perform
 * @param {object} options - CLI options
 * @returns {Promise}
 */
function bumpManifest(manifest, defaultBumpType, options) {
  return new Promise(function(resolve, reject) {
    if (options.prompt) {
      // Prompt the user for the type of bump to perform
      var version = api.versionInfo(manifest, options);
      console.log('\nCurrent version in %s is %s', manifest, version.current);

      inquirer.prompt({
        type: 'list',
        name: 'bump',
        message: 'How would you like to bump it?',
        default: defaultBumpType,
        choices: [
          {value: 'major', name: 'major (' + version.nextMajor + ')'},
          {value: 'minor', name: 'minor (' + version.nextMinor + ')'},
          {value: 'patch', name: 'patch (' + version.nextPatch + ')'},
          {value: 'premajor', name: 'pre-release major (' + version.nextPreMajor + ')'},
          {value: 'preminor', name: 'pre-release minor (' + version.nextPreMinor + ')'},
          {value: 'prepatch', name: 'pre-relase patch (' + version.nextPrePatch + ')'},
          {value: 'prerelease', name: 'pre-release (' + version.nextPreRelease + ')'}
        ]
      })
      .then(function(answer) {
        api.runNpmScriptIfExists(manifest, 'preversion');
        bump(answer.bump);
      });
    }
    else {
      var bumpType =
            options.major ? 'major' :
            options.minor ? 'minor' :
            options.patch ? 'patch' :
            options.premajor ? 'premajor' :
            options.preminor ? 'preminor' :
            options.prepatch ? 'prepatch' :
            options.prerelease ? 'prerelease' :
            defaultBumpType;
      api.runNpmScriptIfExists(manifest, 'preversion');
      bump(bumpType);
    }

    function bump(bumpType) {
      try {
        api.bump(manifest, bumpType, options);
      } catch(ex) {
        reject(ex);
      }
      resolve(bumpType);
    }
  });
}
