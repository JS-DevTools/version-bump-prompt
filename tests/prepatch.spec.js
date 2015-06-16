'use strict';

var helper = require('./helper');

describe('bump --prepatch', function() {
  it('should not increment a non-existent version number', function() {
    helper.bump('--prepatch', {}, {});
  });

  it('should increment an all-zero version number', function() {
    helper.bump('--prepatch', {version: '0.0.0'}, {version: '0.0.1-beta.0'});
  });

  it('should reset the minor and patch', function() {
    helper.bump('--prepatch', {version: '1.2.3'}, {version: '1.2.4-beta.0'});
  });

  it('should reset the prerelease version', function() {
    helper.bump('--prepatch', {version: '1.2.3-beta.4'}, {version: '1.2.4-beta.0'});
  });

  it('should honor the --preid flag', function() {
    helper.bump('--prepatch --preid alpha', {version: '1.2.3-beta.4'}, {version: '1.2.4-alpha.0'});
  });
});
