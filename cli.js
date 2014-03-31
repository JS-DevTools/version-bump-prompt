#!/usr/bin/env node
'use strict';

var multiline = require('multiline'),
	nopt = require('nopt'),
	bump = require('./index').bump;

function help(){
	console.log(multiline.stripIndent(function(){/*
		Update package version and create tag

		Usage
		  bump <type>

		Example
		  bump --patch
		  bump --minor
		  bump --major
	*/}));
}

function getType(options){
	var type;

	type = ['major', 'minor', 'patch'].filter(function(type){
		return options[type];
	});

	if(type.length){
		return type[0];
	}
}

function init(options){
	var type;

	if(options.help){
		return help();
	}

	if(options.version){
		return console.log(require('./package').version);
	}

	type = getType(options);

	return type && bump(type);
}

var options = nopt({
	help: Boolean,
	version: Boolean,
	patch: Boolean,
	minor: Boolean,
	major: Boolean
}, {
	h: '--help',
	v: '--version'
});

if(options.argv.original.length){
	init(options);
}else{
	help();
}
