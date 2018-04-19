# Change Log
All notable changes will be documented in this file.
`version-bump-prompt` adheres to [Semantic Versioning](http://semver.org/).

## [v4.1.0](https://github.com/BigstickCarpet/version-bump-prompt/tree/v4.1.0) (2017-11-15)

- Added `--lock` option to update the `package-json.lock` file in addition to manifest files.  See [issue #20](https://github.com/BigstickCarpet/version-bump-prompt/issues/20) for details.  Thanks to [@browniebroke](https://github.com/browniebroke) for [the PR](https://github.com/BigstickCarpet/version-bump-prompt/pull/23/files)!

[Full Changelog](https://github.com/BigstickCarpet/version-bump-prompt/compare/v4.0.0...v4.1.0)


## [v4.0.0](https://github.com/BigstickCarpet/version-bump-prompt/tree/v4.0.0) (2017-11-15)

- Dropped support for Node v4.x since it's no longer supported by [`inquirer`](https://www.npmjs.com/package/inquirer). As a result, Version-Bump-Prompt now only supports Node v6+.  You can continue using Version-Bump-Prompt v3.x on Node 4.

[Full Changelog](https://github.com/BigstickCarpet/version-bump-prompt/compare/v3.0.0...v4.0.0)


## [v3.0.0](https://github.com/BigstickCarpet/version-bump-prompt/tree/v3.0.0) (2016-12-25)

Two big changes in this version:

- Dropped support for Node v0.x
- The `--prompt` option now allows you to manually enter a version, rather than only selecting from the listed options
- Added support for [npm version scripts](https://docs.npmjs.com/cli/version). (big thanks to [szarouski](https://github.com/szarouski) for his [PR](https://github.com/BigstickCarpet/version-bump-prompt/pull/17))<br> The scripts are run the same order as the `npm version` command:
  - The `preversion` script runs before the version is updated (and before the version prompt is shown)
  - The `version` script runs after the version is updated, but _before_ `git commit` and `git tag`
  - The `postversion` script runs after `git commit` and `git tag`, but _before_ `git push`

[Full Changelog](https://github.com/BigstickCarpet/version-bump-prompt/compare/v2.0.0...v3.0.0)


## [v2.0.0](https://github.com/BigstickCarpet/version-bump-prompt/tree/v2.0.0) (2016-11-29)

A couple of changes to make `version-bump-prompt` behave more like the `npm version` command:

- The `--tag` option now creates an [annotated git tag rather than a lightweight tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Creating-Tags).

- The `--tag` option now follows the same naming convention as the `npm version` command. The tag name is `vX.X.X` (same as before), and the commit message is `X.X.X` (no "v" prefix).

[Full Changelog](https://github.com/BigstickCarpet/version-bump-prompt/compare/v1.7.2...v2.0.0)
