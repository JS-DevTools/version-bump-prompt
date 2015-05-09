'use strict';

var semver = require('semver'),
    exec   = require('child-process-promise').exec,
    cwd    = process.cwd(),
    fs     = require('fs'),
    path   = require('path'),
    indent = require('detect-indent'),
    version;

/**
 * These are the files that will be updated automatically by version-bump-prompt.
 *
 * @returns {string[]} - Only the files that exist are returned, so the result might be an empty array.
 */
exports.manifests = function() {
  return ['package.json', 'bower.json', 'component.json'].filter(function(manifest) {
    return fs.existsSync(cwd + '/' + manifest);
  });
};

/**
 * Returns information about the current next versions of the given manifest file.
 *
 * @param {string} manifest - The name of the manifest file (e.g. "package.json")
 * @param {string} [identifier] - The identifier to use for pre-release versions (defaults to "beta")
 * @returns {VersionInfo}
 */
exports.versionInfo = function(manifest, identifier) {
  var pkgPath = path.join(cwd, manifest);
  var pkg = require(pkgPath);

  var current = new semver(pkg.version || '0.0.0');
  identifier = identifier || current.prerelease[0] || 'beta';

  /** @name VersionInfo **/
  return {
    current: current.version,
    nextMajor: semver.inc(current.version, 'major'),
    nextMinor: semver.inc(current.version, 'minor'),
    nextPatch: semver.inc(current.version, 'patch'),
    nextPreMajor: semver.inc(current.version, 'premajor', identifier),
    nextPreMinor: semver.inc(current.version, 'preminor', identifier),
    nextPrePatch: semver.inc(current.version, 'prepatch', identifier),
    nextPreRelease: semver.inc(current.version, 'prerelease', identifier)
  };
};

/**
 * Updates the version number of the given manifest file.
 *
 * @param {string} manifest - The name of the manifest file (e.g. "package.json")
 * @param {string} type - The type of bump to do ("major", "minor", "patch", "premajor", etc.)
 * @param {string} [identifier] - The identifier to use for pre-release versions (defaults to "beta")
 */
exports.bump = function(manifest, type, identifier) {
  var pkgPath = path.join(cwd, manifest);
  var pkg = require(pkgPath);

  // Increment the version number
  var current = new semver(pkg.version || '0.0.0');
  current.inc(type, identifier || current.prerelease[0] || 'beta');
  version = pkg.version = current.version;

  // Save the file
  var usedIndent = indent(fs.readFileSync(pkgPath, 'utf8')).indent || '  ';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, usedIndent));

  console.log('Updated %s to %s', manifest, current.version);
};

/**
 * Commits changes to git.
 *
 * @param {boolean} all - Whether to commit all changes, or just the manifest files
 * @param {boolean} tag - Whether to tag the commit
 * @param {boolean} push - Whether to push the commit
 */
exports.commit = function(all, tag, push) {
  var filesToCommit = all ? '-a' : exports.manifests().join(' ');

  exec('git commit ' + filesToCommit + ' -m "release v' + version + '"')
    .then(function(out) {
      // out && console.log(out.stdout);
      return tag && exec('git tag v' + version);
    }, logError)

    .then(function() {
      return push && exec('git push && git push --tags');
    }, logError)

    .then(function(out) {
      out && console.log(out.stdout);
    }, logError);
};

function logError(err) {
  console.error(err);
}
