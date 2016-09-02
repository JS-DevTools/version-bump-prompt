'use strict';

var SemVer     = require('semver'),
    spawnSync  = require('spawn-sync'),
    fs         = require('fs'),
    path       = require('path'),
    glob       = require('glob'),
    indent     = require('detect-indent'),
    logSymbols = require('log-symbols'),
    chalk      = require('chalk'),
    cwd        = process.cwd(),
    oldVersion, newVersion;

module.exports = {
  manifests: manifests,
  versionInfo: versionInfo,
  bump: bump,
  grep: grep,
  git: git
};

/**
 * These are the files that will be updated automatically by version-bump-prompt.
 * Only the files that exist and have a "version" property are returned, so the result might be an empty array.
 *
 * @returns {string[]}
 */
function manifests() {
  return ['package.json', 'bower.json', 'component.json'].filter(function(manifest) {
    var pkgPath = path.join(cwd, manifest);
    try {
      var pkg = require(pkgPath);
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
function versionInfo(manifest, options) {
  var pkgPath = path.join(cwd, manifest);
  var pkg = require(pkgPath);

  var current = new SemVer(pkg.version || '0.0.0');
  var identifier = options.preid || current.prerelease[0] || 'beta';

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
function bump(manifest, type, options) {
  var pkgPath = path.join(cwd, manifest);
  var pkg = require(pkgPath);

  // Increment the version number
  oldVersion = pkg.version || '0.0.0';
  var current = new SemVer(oldVersion);
  current.inc(type, options.preid || current.prerelease[0] || 'beta');
  newVersion = pkg.version = current.version;

  // Save the file
  var usedIndent = indent(fs.readFileSync(pkgPath, 'utf8')).indent || '  ';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, usedIndent));

  console.log('%s Updated %s to %s', logSymbols.success, manifest, current.version);
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
function grep(manifests, options) {
  if (options.grep) {
    // Separate the glob patterns into two lists: included and excluded
    var included = [], excluded = [];
    options.grep.forEach(function(pattern) {
      if (pattern[0] === '!') {
        excluded.push(pattern);
      }
      else {
        included.push(pattern);
      }
    });

    // Process each glob pattern
    included.forEach(function(pattern) {
      var files = glob.sync(pattern, {nodir: true, ignore: excluded});

      // Process each matched file
      files.forEach(function(file) {
        // Read the file
        var fileContents = fs.readFileSync(file, {encoding: 'utf8'});

        // Replace the old version number with the new version number
        var oldVersionPattern = new RegExp(oldVersion.replace(/\./g, '\\.'), 'g');
        var newFileContents = fileContents.replace(oldVersionPattern, newVersion);

        // Only save the file if there were changes
        if (newFileContents !== fileContents) {
          fs.writeFileSync(file, newFileContents);
          manifests.push(file);
          console.log('%s Updated %s to %s', logSymbols.success, file, newVersion);
        }
      });
    });
  }
}

/**
 * Commits to Git, optionally tagging and pushing the commit.
 *
 * @param {string[]} manifests - An array of manifest files to bump
 * @param {object} options - CLI options
 */
function git(manifests, options) {
  if (options.commit || options.tag || options.push) {
    // Git Commit
    var commitArgs = ['commit'];
    commitArgs = commitArgs.concat(options.all ? '-a' : manifests);
    var commitMessage = '"release v' + newVersion + '"';
    if (options.commitMessage) {
      commitMessage = '"v' + newVersion + ' ' + options.commitMessage + '"';
    }
    commitArgs = commitArgs.concat(['-m', commitMessage]);
    exec('git', commitArgs);
    console.log(logSymbols.success, 'Git commit');

    // Git Tag
    if (options.tag) {
      exec('git', ['tag', 'v' + newVersion]);
      console.log(logSymbols.success, 'Git tag');
    }

    // Git Push
    if (options.push) {
      exec('git', ['push']);
      options.tag && exec('git', ['push', '--tags']);
      console.log(logSymbols.success, 'Git push');
    }
  }
}

/**
 * Synchronously executes a command as a child process.
 * An exception is thrown if the child process errors.
 *
 * @param {string}    command - The command to run
 * @param {string[]}  args - An array of arguments to pass
 */
function exec(command, args) {
  var result = spawnSync(command, args);
  var output = result.stdout.toString() || result.stderr.toString();

  if (result.status || result.error) {
    console.error(
      chalk.bold.red('Error running command:'),
      chalk.reset.magenta(command, args.join(' '))
    );

    var err = new Error(output);
    err.status = result.status;
    throw err;
  }
}
