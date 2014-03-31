#!/usr/bin/env node
'use strict';

var multiline = require('multiline'),
	nopt = require('nopt'),
	program = require('commander'),
	bump = require('./index').bump;

function getType(options){
	var type;

	type = ['major', 'minor', 'patch'].filter(function(type){
		return options[type];
	});

	if(type.length){
		return type[0];
	}
}

function init(program){
	var type;

	type = getType(program);

	console.log(type);
	// return type && bump(type);
}
/*
var options = nopt({
	help: Boolean,
	version: Boolean,
	patch: Boolean,
	minor: Boolean,
	major: Boolean
}, {
	h: '--help',
	v: '--version'
});*/

/*if(options.argv.original.length){
	init(options);
}else{
	help();
}
*/

program
	.version(require('./package').version)
	.usage('[options]')
	.option('--patch', 'Increase patch version')
	.option('--minor', 'Increase minor version')
	.option('--major', 'Increase major version');

program.on('--help', function(){
	console.log(multiline(function(){/*
  Usage:

    $ bump --patch
    $ bump --patch --no-tags
    $ bump --info
	*/}));
});

program.parse(process.argv);

if(program.rawArgs.length > 2){
	init(program);
}else{
	program.help();
}

