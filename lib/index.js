'use strict';

const SemVer = require('semver');
const spawnSync = require('cross-spawn').sync;
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const indent = require('detect-indent');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const cwd = process.cwd();

let oldVersion, newVersion;

module.exports = {
  manifests: getManifests,
  versionInfo,
  bump,
  runNpmScriptIfExists,
  grep,
  git
};

/**
 * These are the files that will be updated automatically by version-bump-prompt.
 * Only the files that exist and have a "version" property are returned, so the result might be an empty array.
 *
 * @returns {string[]}
 */
function getManifests (withLockfile) {
  let candidates = ['package.json', 'bower.json', 'component.json'];
  if (withLockfile) {
    candidates.push('package-lock.json');
  }
  return candidates.filter((manifest) => {
    let pkgPath = path.join(cwd, manifest);
    try {
      const pkg = require(pkgPath);
      return pkg.hasOwnProperty('version');
    }
    catch (err) {
      return false;
    }
  });
}

/**
 * Returns information about the current next versions of the given manifest file.
 *
 * @param {string}  manifest - The name of the manifest file (e.g. "package.json")
 * @param {object}  options - CLI options
 * @returns {VersionInfo}
 */
function versionInfo (manifest, options) {
  let pkgPath = path.join(cwd, manifest);
  const pkg = require(pkgPath);

  let current = new SemVer(pkg.version || '0.0.0');
  let identifier = options.preid || current.prerelease[0] || 'beta';

  /** @name VersionInfo **/
  return {
    current: current.version,
    nextMajor: SemVer.inc(current.version, 'major'),
    nextMinor: SemVer.inc(current.version, 'minor'),
    nextPatch: SemVer.inc(current.version, 'patch'),
    nextPreMajor: SemVer.inc(current.version, 'premajor', identifier),
    nextPreMinor: SemVer.inc(current.version, 'preminor', identifier),
    nextPrePatch: SemVer.inc(current.version, 'prepatch', identifier),
    nextPreRelease: SemVer.inc(current.version, 'prerelease', identifier)
  };
}

/**
 * Updates the version number of the given manifest file.
 *
 * @param {string} manifest - The name of the manifest file (e.g. "package.json")
 * @param {string} type - The type of bump to do ("major", "minor", "patch", "premajor", etc.)
 * @param {object}  options - CLI options
 */
function bump (manifest, type, options) {
  let pkgPath = path.join(cwd, manifest);
  const pkg = require(pkgPath);

  oldVersion = pkg.version || '0.0.0';

  if (type === 'custom') {
    newVersion = options.newVersion;
  }
  else {
    // Increment the version number
    let current = new SemVer(oldVersion);
    current.inc(type, options.preid || current.prerelease[0] || 'beta');
    newVersion = current.version;
  }

  if (newVersion !== oldVersion) {
    // Save the file
    let usedIndent = indent(fs.readFileSync(pkgPath, 'utf8')).indent || '  ';

    pkg.version = newVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, usedIndent));

    console.log('%s Updated %s to %s', logSymbols.success, manifest, newVersion);
  }
}

/**
 * Takes npm scripts object and if a script exists, runs the script.
 *
 * @param {string} manifest - The name of the manifest file (e.g. "package.json")
 * @param {string} script - Name of the script ("preversion", "postversion", etc.)
 */
function runNpmScriptIfExists (manifest, script) {
  if (manifest !== 'package.json') {
    return;
  }
  let pkgPath = path.join(cwd, manifest);
  const pkg = require(pkgPath);
  let pkgScripts = pkg.scripts;

  if (pkgScripts && pkgScripts[script]) {
    exec('npm', ['run', script]);
  }
}

/**
 * Performs text replacements of the old version string with the new version string
 * in the {@link options.grep} file list.
 *
 * @param {string[]} manifests
 * - The manifest files. Any files affected by {@link grep} will be added to this array.
 *
 * @param {object}  options - CLI options
 */
function grep (manifests, options) {
  if (newVersion === oldVersion) {
    return;
  }

  if (!options.grep) {
    return;
  }

  // Separate the glob patterns into two lists: included and excluded
  let included = [], excluded = [];
  options.grep.forEach((pattern) => {
    if (pattern[0] === '!') {
      excluded.push(pattern);
    }
    else {
      included.push(pattern);
    }
  });

  // Process each glob pattern
  included.forEach((pattern) => {
    let files = glob.sync(pattern, { nodir: true, ignore: excluded });

    // Process each matched file
    files.forEach((file) => {
      // Read the file
      let fileContents = fs.readFileSync(file, { encoding: 'utf8' });

      // Replace the old version number with the new version number
      let oldVersionPattern = new RegExp(oldVersion.replace(/\./g, '\\.'), 'g');
      let newFileContents = fileContents.replace(oldVersionPattern, newVersion);

      // Only save the file if there were changes
      if (newFileContents !== fileContents) {
        fs.writeFileSync(file, newFileContents);
        manifests.push(file);
        console.log('%s Updated %s to %s', logSymbols.success, file, newVersion);
      }
    });
  });
}

/**
 * Commits to Git, optionally tagging and pushing the commit.
 *
 * @param {string[]} manifests - An array of manifest files to bump
 * @param {object} options - CLI options
 */
function git (manifests, options) {
  if (newVersion === oldVersion) {
    return;
  }

  if (!(options.commit || options.tag || options.push)) {
    return;
  }

  // Git Commit
  let commitArgs = ['commit'];
  commitArgs = commitArgs.concat(options.all ? '-a' : manifests);
  let commitMessage = 'release v' + newVersion;
  if (options.commitMessage) {
    commitMessage = 'v' + newVersion + ' ' + options.commitMessage;
  }
  commitArgs = commitArgs.concat(['-m', commitMessage]);
  exec('git', commitArgs);
  console.log(logSymbols.success, 'Git commit');

  // Git Tag
  if (options.tag) {
    exec('git', ['tag', '-a', 'v' + newVersion, '-m', newVersion]);
    console.log(logSymbols.success, 'Git tag');
  }

  manifests.forEach((manifest) => {
    runNpmScriptIfExists(manifest, 'postversion');
  });

  // Git Push
  if (options.push) {
    exec('git', ['push']);
    options.tag && exec('git', ['push', '--tags']);
    console.log(logSymbols.success, 'Git push');
  }
}

/**
 * Synchronously executes a command as a child process.
 * An exception is thrown if the child process errors.
 *
 * @param {string}    command - The command to run
 * @param {string[]}  args - An array of arguments to pass
 */
function exec (command, args) {
  let result = spawnSync(command, args);

  if (result.status || result.error) {
    console.error(
      chalk.bold.red('Error running command:'),
      chalk.reset.magenta(command, args.join(' '))
    );

    let err = result.error;
    if (!result.error) {
      let output = result.stdout.toString() || result.stderr.toString();
      err = new Error(output);
    }
    err.status = result.status;
    throw err;
  }
}
