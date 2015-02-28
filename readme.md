# Version-Bump-Prompt

[![Dependencies](https://img.shields.io/david/bigstickcarpet/version-bump-prompt.svg)](https://david-dm.org/bigstickcarpet/version-bump-prompt)
[![npm](http://img.shields.io/npm/v/version-bump-prompt.svg)](https://www.npmjs.com/package/version-bump-prompt)
[![License](https://img.shields.io/npm/l/version-bump-prompt.svg)](http://en.wikipedia.org/wiki/MIT_License)

![Build Status](https://github.com/BigstickCarpet/version-bump-prompt/blob/master/screenshot.gif)

#### Automate your release process with a single command that:

 * Bumps the version number of:
     *  `package.json`
     *  `bower.json`
     *  `component.json`
 * Creates a GIT tag
 * Pushes to GIT
 * Optionally prompts for type of version bump

## Install

	npm install -g version-bump-prompt

## Usage

	bump [options]

 * `--patch`, `--minor`, `--major`, `--prompt` - Increase corresponding version number (or prompt)
 * `--commit` - Commit changed files to Git
 * `--tag` - Commit and tag changed files in Git
 * `--push` - Commit and push changed files to remote Git repo
 * `--all` - Commit/tag/push all files that have changed, not just the ones changed by bump
 
## TODO

 * `--files` Get list of manifests for update
 * `--info` Shows latest tag and manifests version

## License

Version-Bump-Prompt is a fork of [Version-Bump](https://github.com/alexeyraspopov/node-bump) by Alexey Raspopov (c).   
Both the original project and this fork are licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)  
