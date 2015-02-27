# Version-Bump-Prompt

[![Dependencies](https://img.shields.io/david/bigstickcarpet/version-bump-prompt.svg)](https://david-dm.org/bigstickcarpet/version-bump-prompt)
[![npm](http://img.shields.io/npm/v/swagger-parser.svg)](https://www.npmjs.com/package/version-bump-prompt)
[![License](https://img.shields.io/npm/l/swagger-parser.svg)](http://en.wikipedia.org/wiki/MIT_License)

![Build Status](https://github.com/BigstickCarpet/version-bump-prompt/blob/master/screenshot.gif)

#### Automate your release process with a single command

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

 * `--patch`, `--minor`, `--major`, `--prompt` - Increase version number (or prompt)
 * `--no-tags` - Do not create git tag
 * `--push` - Push to remote repo

## TODO

 * `--files` get list of manifests for update
 * `--info` shows latest tag and manifests version

## License

Version-Bump-Prompt is a fork of [Version-Bump](https://github.com/alexeyraspopov/node-bump) by Alexey Raspopov (c).   
Both the original project and this fork are licensed under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)  
