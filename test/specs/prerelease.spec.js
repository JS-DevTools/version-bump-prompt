'use strict';

var helper = require('../fixtures/helper');

describe('bump --prerelease', function() {
  it('should not increment a non-existent version number', function() {
    helper.bump('--prerelease', {}, {});
  });

  it('should increment an all-zero version number', function() {
    helper.bump('--prerelease', {version: '0.0.0'}, {version: '0.0.1-beta.0'});
  });

  it('should reset the minor and patch', function() {
    helper.bump('--prerelease', {version: '1.2.3'}, {version: '1.2.4-beta.0'});
  });

  it('should reset the prerelease version', function() {
    helper.bump('--prerelease', {version: '1.2.3-beta.4'}, {version: '1.2.3-beta.5'});
  });

  it('should honor the --preid flag', function() {
    helper.bump('--prerelease --preid alpha', {version: '1.2.3-beta.4'}, {version: '1.2.3-alpha.0'});
  });
});
