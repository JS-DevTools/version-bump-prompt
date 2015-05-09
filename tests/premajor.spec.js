'use strict';

var bumpTest = require('./bump-test');

describe('bump --premajor', function() {
  it('should increment a non-existent version number', function() {
    bumpTest('--premajor', {}, {version: '1.0.0-beta.0'});
  });

  it('should increment an all-zero version number', function() {
    bumpTest('--premajor', {version: '0.0.0'}, {version: '1.0.0-beta.0'});
  });

  it('should reset the minor and patch', function() {
    bumpTest('--premajor', {version: '1.2.3'}, {version: '2.0.0-beta.0'});
  });

  it('should reset the prerelease version', function() {
    bumpTest('--premajor', {version: '1.2.3-beta.4'}, {version: '2.0.0-beta.0'});
  });

  it('should honor the --preid flag', function() {
    bumpTest('--premajor --preid alpha', {version: '1.2.3-beta.4'}, {version: '2.0.0-alpha.0'});
  });
});
