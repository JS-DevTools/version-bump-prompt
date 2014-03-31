var semver = require('semver'),
	exec = require('child-process-promise').exec,
	pkg = process.cwd() + '/package.json',
	fs = require('fs'),
	indent = require('detect-indent');

function logError(err){
	console.log(err.stderr);
}

exports.bump = function(type, options){
	var current = require(pkg);

	current.version = semver.inc(current.version, type);

	var usedIndent = indent(fs.readFileSync(pkg, 'utf8')) || '  ';

	fs.writeFileSync(pkg, JSON.stringify(current, null, usedIndent));

	if(options.tags){
		exec('git commit package.json -m "release v' + current.version + '"')
			.then(function(out){
				console.log(out.stdout);
				return exec('git tag v' + current.version)
			}, logError)

			.then(function(out){
				console.log(out.stdout, current.version);
				return options.push && exec('git push && git push --tags');
			}, logError)

			.then(function(out){
				console.log(out && out.stdout);
			}, logError);
	}
};
