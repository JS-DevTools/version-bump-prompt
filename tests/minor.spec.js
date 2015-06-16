'use strict';

var helper = require('./helper');

describe('bump --minor', function() {
  it('should not increment a non-existent version number', function() {
    helper.bump('--minor', {}, {});
  });

  it('should increment an all-zero version number', function() {
    helper.bump('--minor', {version: '0.0.0'}, {version: '0.1.0'});
  });

  it('should reset the patch', function() {
    helper.bump('--minor', {version: '1.2.3'}, {version: '1.3.0'});
  });

  it('should reset the prerelease version', function() {
    helper.bump('--minor', {version: '1.2.3-beta.4'}, {version: '1.3.0'});
  });

  it('should not be affected by the --preid flag', function() {
    helper.bump('--minor --preid alpha', {version: '1.2.3-beta.4'}, {version: '1.3.0'});
  });
});
