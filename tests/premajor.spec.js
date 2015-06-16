'use strict';

var helper = require('./helper');

describe('bump --premajor', function() {
  it('should not increment a non-existent version number', function() {
    helper.bump('--premajor', {}, {});
  });

  it('should increment an all-zero version number', function() {
    helper.bump('--premajor', {version: '0.0.0'}, {version: '1.0.0-beta.0'});
  });

  it('should reset the minor and patch', function() {
    helper.bump('--premajor', {version: '1.2.3'}, {version: '2.0.0-beta.0'});
  });

  it('should reset the prerelease version', function() {
    helper.bump('--premajor', {version: '1.2.3-beta.4'}, {version: '2.0.0-beta.0'});
  });

  it('should honor the --preid flag', function() {
    helper.bump('--premajor --preid alpha', {version: '1.2.3-beta.4'}, {version: '2.0.0-alpha.0'});
  });
});
