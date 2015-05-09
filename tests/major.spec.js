'use strict';

var bumpTest = require('./bump-test');

describe('bump --major', function() {
  it('should increment a non-existent version number', function() {
    bumpTest('--major', {}, {version: '1.0.0'});
  });

  it('should increment an all-zero version number', function() {
    bumpTest('--major', {version: '0.0.0'}, {version: '1.0.0'});
  });

  it('should reset the minor and patch', function() {
    bumpTest('--major', {version: '1.2.3'}, {version: '2.0.0'});
  });

  it('should reset the prerelease version', function() {
    bumpTest('--major', {version: '1.2.3-beta.4'}, {version: '2.0.0'});
  });

  it('should not be affected by the --preid flag', function() {
    bumpTest('--major --preid alpha', {version: '1.2.3-beta.4'}, {version: '2.0.0'});
  });
});
