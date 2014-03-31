var multiline = require('multiline');

var nopt = require('nopt');

var bump = require('./index');

var help = multiline.stripIndent(function(){/*
	Update package version and create tag

	Usage
	  bump <type>

	Example
	  bump --patch
	  bump --minor
	  bump --major
*/});


var options = nopt({
	help: Boolean,
	patch: Boolean,
	minor: Boolean,
	major: Boolean
});
