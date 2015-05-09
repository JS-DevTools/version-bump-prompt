'use strict';

var bumpTest = require('./bump-test');

describe('bump --patch', function() {
  it('should increment a non-existent version number', function() {
    bumpTest('--patch', {}, {version: '0.0.1'});
  });

  it('should increment an all-zero version number', function() {
    bumpTest('--patch', {version: '0.0.0'}, {version: '0.0.1'});
  });

  it('should increment the patch', function() {
    bumpTest('--patch', {version: '1.2.3'}, {version: '1.2.4'});
  });

  it('should reset the prerelease version', function() {
    bumpTest('--patch', {version: '1.2.3-beta.4'}, {version: '1.2.3'});
  });

  it('should not be affected by the --preid flag', function() {
    bumpTest('--patch --preid alpha', {version: '1.2.3-beta.4'}, {version: '1.2.3'});
  });
});
