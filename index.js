var semver = require('semver'),
	exec = require('child_process').exec,
	pkg = process.cwd() + '/package.json',
	fs = require('fs'),
	indent = require('detect-indent');

exports.bump = function(type){
	var current = require(pkg);

	current.version = semver.inc(current.version, type);

	var usedIndent = indent(fs.readFileSync(pkg, 'utf8')) || '  ';

	fs.writeFileSync(pkg, JSON.stringify(current, null, usedIndent));

	exec('git commit package.json -m "release ' + current.version + '"', function(err, stdout, stderr){
		if(err){
			console.log('commit', stderr);
		}else{
			console.log(current.version);
			exec('git tag v' + current.version, function(err, stdout, stderr){
				if(err){
					console.log(err);
				}
			});
		}
	});
};
