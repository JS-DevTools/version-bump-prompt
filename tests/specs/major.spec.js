'use strict';

var helper = require('../fixtures/helper');

describe('bump --major', function() {
  it('should not increment a non-existent version number', function() {
    helper.bump('--major', {}, {});
  });

  it('should increment an all-zero version number', function() {
    helper.bump('--major', {version: '0.0.0'}, {version: '1.0.0'});
  });

  it('should reset the minor and patch', function() {
    helper.bump('--major', {version: '1.2.3'}, {version: '2.0.0'});
  });

  it('should reset the prerelease version', function() {
    helper.bump('--major', {version: '1.2.3-beta.4'}, {version: '2.0.0'});
  });

  it('should not be affected by the --preid flag', function() {
    helper.bump('--major --preid alpha', {version: '1.2.3-beta.4'}, {version: '2.0.0'});
  });
});
