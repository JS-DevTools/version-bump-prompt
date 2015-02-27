#!/usr/bin/env node
'use strict';

var multiline = require('multiline'),
	program   = require('commander'),
	prompt    = require('inquirer').prompt,
	api       = require('./index');

program
	.version(require('./package').version)
	.usage('[options]')
	.option('--no-tags', 'Do not create git tag')
	.option('--push', 'Push to remote repo')
	.option('--prompt', 'Prompt for type of bump (patch, minor, major)');

['patch', 'minor', 'major'].forEach(function(type) {
	program.option('--' + type, 'Increase ' + type + ' version');

	program.on(type, function() {
		setTimeout(function() {
			api.manifests().forEach(function(manifest) {
				api.bump(manifest, type);
			});

			tagAndPush();
		}, 0);
	});
});

program.on('prompt', function() {
	var manifests = api.manifests();
	var i = 0;

	bumpNextManifest();

	function bumpNextManifest() {
		if (i < manifests.length) {
			var manifest = manifests[i++];
			var version = api.versionInfo(manifest);

			console.log('\nCurrent version in %s is %s', manifest, version.current);
			prompt({
					type: 'list',
					name: 'bump',
					message: 'How would you like to bump it?',
					default: 'patch',
					choices: [
						{value: 'patch', name: 'patch (' + version.nextPatch + ')'},
						{value: 'minor', name: 'minor (' + version.nextMinor + ')'},
						{value: 'major', name: 'major (' + version.nextMajor + ')'}
					]
				},
				function(answer) {
					api.bump(manifest, answer.bump);
					bumpNextManifest();
				}
			);
		}
		else {
			tagAndPush();
		}
	}

});

program.on('--help', function() {
	console.log(multiline(function() {
/*
  Usage:

   $ bump --patch
   $ bump --major --no-tags
   $ bump --prompt --push

*/
	}));
});

program.parse(process.argv);

if (program.rawArgs.length < 3) {
	program.help();
}

function tagAndPush() {
	if (program.tags) {
		api.tag(program.push);
	}
}

