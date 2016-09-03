# Version-Bump-Prompt

[![Build Status](https://api.travis-ci.org/BigstickCarpet/version-bump-prompt.svg?branch=master)](https://travis-ci.org/BigstickCarpet/version-bump-prompt)
[![Dependencies](https://david-dm.org/BigstickCarpet/version-bump-prompt.svg)](https://david-dm.org/bigstickcarpet/version-bump-prompt)
[![npm](http://img.shields.io/npm/v/version-bump-prompt.svg)](https://www.npmjs.com/package/version-bump-prompt)
[![License](https://img.shields.io/npm/l/version-bump-prompt.svg)](http://en.wikipedia.org/wiki/MIT_License)

![Screenshot](http://bigstickcarpet.com/version-bump-prompt/img/screenshot.gif)

#### Automate your release process with a single command that can:

 * Bump the version number of JSON manifets, including:
    -  `package.json`
    -  `bower.json`
    -  `component.json`
 * Replace version number strings in text files, including:
    -  config files
    -  source code
    -  README files
    -  license files
 * Commit changes to GIT
 * Tag the commit with the version number
 * Push the commit to remote
 * Optionally prompt for the type of version bump (major, minor, revision, beta, etc.)


## Install

	npm install -g version-bump-prompt


## Usage

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

Examples:

  $ bump --patch
  $ bump --major --tag
  $ bump --patch --tag --all --grep README.md LICENSE
  $ bump --prompt --tag --push --all
```


## License

Version-Bump-Prompt is a fork of [Version-Bump](https://github.com/alexeyraspopov/node-bump) by Alexey Raspopov (c).
Both the original project and this fork are licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)
