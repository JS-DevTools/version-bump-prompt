#!/usr/bin/env node
'use strict';

var multiline = require('multiline'),
	program = require('commander'),
	bump = require('./index').bump;

program
	.version(require('./package').version)
	.usage('[options]')
	.option('--no-tags', 'Do not create git tag');

['patch', 'minor', 'major'].forEach(function(type){
	program.option('--' + type, 'Increase ' + type + ' version');

	program.on(type, function(){
		setTimeout(function(){
			bump(type, {
				tags: program.tags
			});
		}, 0);
	});
});

program.on('--help', function(){
	console.log(multiline(function(){/*
  Usage:

    $ bump --patch
    $ bump --patch --no-tags
    $ bump --info
	*/}));
});

program.parse(process.argv);

if(program.rawArgs.length < 3){
	program.help();
}

