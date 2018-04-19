# Version-Bump-Prompt

[![Build Status](https://api.travis-ci.org/BigstickCarpet/version-bump-prompt.svg?branch=master)](https://travis-ci.org/BigstickCarpet/version-bump-prompt)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/bigstickcarpet/version-bump-prompt?svg=true&branch=master&failingText=Windows%20build%20failing&passingText=Windows%20build%20passing)](https://ci.appveyor.com/project/BigstickCarpet/version-bump-prompt/branch/master)

[![Codacy Score](https://api.codacy.com/project/badge/Grade/69891525ae984781996106144fda276c)](https://www.codacy.com/public/jamesmessinger/version-bump-prompt)
[![Inline docs](http://inch-ci.org/github/BigstickCarpet/version-bump-prompt.svg?branch=master&style=shields)](http://inch-ci.org/github/BigstickCarpet/version-bump-prompt)
[![Dependencies](https://david-dm.org/BigstickCarpet/version-bump-prompt.svg)](https://david-dm.org/bigstickcarpet/version-bump-prompt)

[![npm](http://img.shields.io/npm/v/version-bump-prompt.svg)](https://www.npmjs.com/package/version-bump-prompt)
[![License](https://img.shields.io/npm/l/version-bump-prompt.svg)](LICENSE)

![Screenshot](http://bigstickcarpet.com/version-bump-prompt/img/screenshot.gif)

#### Automate your release process with a single command that can:

 * Optionally prompt for the type of version bump (major, minor, revision, beta, etc.)
 * Bump the version number in all of your JSON manifests, including:
    -  `package.json`
    -  `bower.json`
    -  `component.json`
 * Replace version number strings in text files, including:
    -  config files
    -  source code
    -  README files
    -  license files
 * Run your `preversion`, `version`, and `postversion` scripts
 * Commit changes to GIT
 * Tag the commit with the version number
 * Push the commit to remote


Installation
--------------------------
You can install `version-bump-prompt` via [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```bash
npm install -g version-bump-prompt
```


Usage
--------------------------

```bash
Usage: bump [options]

Options:

  -h, --help            output usage information
  -V, --version         output the version number
  --major               Increase major version
  --minor               Increase minor version
  --patch               Increase patch version
  --premajor            Increase major version, pre-release
  --preminor            Increase preminor version, pre-release
  --prepatch            Increase prepatch version, pre-release
  --prerelease          Increase prerelease version
  --prompt              Prompt for type of bump (patch, minor, major, premajor, prerelase, etc.)
  --preid <name>        The identifier for prerelease versions (default is "beta")
  --commit [message]    Commit changed files to Git (default message is "release vX.X.X")
  --tag                 Tag the commit in Git
  --push                Push the Git commit
  --all                 Commit/tag/push ALL pending files, not just the ones changed by bump
  --grep <filespec...>  Files and/or globs to do a text-replace of the old version number with the new one
  --lock                Update the package-lock.json file as well

Examples:

  $ bump --patch
  $ bump --major --tag
  $ bump --patch --tag --all --grep README.md LICENSE
  $ bump --prompt --tag --push --all
```


Version Scripts
--------------------------
`version-bump-prompt` will execute your `preversion`, `version`, and `postversion` scripts, just like [the `npm version` command](https://docs.npmjs.com/cli/version) does. If your `package.json` file contains any or all of these scripts, then they will be executed in the following order:

  - The `preversion` script runs before the version is updated (and before the version prompt is shown)
  - The `version` script runs after the version is updated, but _before_ `git commit` and `git tag`
  - The `postversion` script runs after `git commit` and `git tag`, but _before_ `git push`



Contributing
--------------------------
I welcome any contributions, enhancements, and bug-fixes.  [File an issue](https://github.com/BigstickCarpet/version-bump-prompt/issues) on GitHub and [submit a pull request](https://github.com/BigstickCarpet/version-bump-prompt/pulls).

#### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/bigstickcarpet/version-bump-prompt.git`

2. __Install dependencies__<br>
`npm install`

3. __Run the tests__<br>
`npm test`



License
--------------------------
Version-Bump-Prompt is a fork of [Version-Bump](https://github.com/alexeyraspopov/node-bump) by Alexey Raspopov (c).
Both the original project and this fork are licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)
