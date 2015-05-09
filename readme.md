# Version-Bump-Prompt

[![Dependencies](https://img.shields.io/david/bigstickcarpet/version-bump-prompt.svg)](https://david-dm.org/bigstickcarpet/version-bump-prompt)
[![npm](http://img.shields.io/npm/v/version-bump-prompt.svg)](https://www.npmjs.com/package/version-bump-prompt)
[![License](https://img.shields.io/npm/l/version-bump-prompt.svg)](http://en.wikipedia.org/wiki/MIT_License)

![Screenshot](http://bigstickcarpet.com/version-bump-prompt/img/screenshot.gif)

#### Automate your release process with a single command that can:

 * Bump the version number of JSON manifets, including:
     *  `package.json`
     *  `bower.json`
     *  `component.json`
 * Commit changes to GIT
 * Tag the commit with the version number
 * Push the commit to remote
 * Optionally prompt for the type of version bump (major, minor, revision, beta, etc.)


## Install

	npm install -g version-bump-prompt


## Usage

	bump [options]

 * `--major`, `--minor`, `--patch`, `--premajor`, `--preminor`, `--prepatch`, `--prerelease`<br> - Bump the corresponding version number
 * `--prompt` - Prompt for which version to bump
 * `--preid [name]` - The identifier for pre-release versions (defaults to `beta`)
 * `--commit` - Commit changed files to Git
 * `--tag` - Tag the commit with the new version number
 * `--push` - Push the commit to your remote Git repo
 * `--all` - Commit/tag/push _all_ pending files, not just the ones changed by bump


## License

Version-Bump-Prompt is a fork of [Version-Bump](https://github.com/alexeyraspopov/node-bump) by Alexey Raspopov (c).   
Both the original project and this fork are licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)  
