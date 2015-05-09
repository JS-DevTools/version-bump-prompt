'use strict';

var bumpTest = require('./bump-test');

describe('bump --prepatch', function() {
  it('should increment a non-existent version number', function() {
    bumpTest('--prepatch', {}, {version: '0.0.1-beta.0'});
  });

  it('should increment an all-zero version number', function() {
    bumpTest('--prepatch', {version: '0.0.0'}, {version: '0.0.1-beta.0'});
  });

  it('should reset the minor and patch', function() {
    bumpTest('--prepatch', {version: '1.2.3'}, {version: '1.2.4-beta.0'});
  });

  it('should reset the prerelease version', function() {
    bumpTest('--prepatch', {version: '1.2.3-beta.4'}, {version: '1.2.4-beta.0'});
  });

  it('should honor the --preid flag', function() {
    bumpTest('--prepatch --preid alpha', {version: '1.2.3-beta.4'}, {version: '1.2.4-alpha.0'});
  });
});
