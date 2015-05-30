'use strict';

var helper = require('./helper');

describe('bump --patch', function() {
  it('should increment a non-existent version number', function() {
    helper.bump('--patch', {}, {version: '0.0.1'});
  });

  it('should increment an all-zero version number', function() {
    helper.bump('--patch', {version: '0.0.0'}, {version: '0.0.1'});
  });

  it('should increment the patch', function() {
    helper.bump('--patch', {version: '1.2.3'}, {version: '1.2.4'});
  });

  it('should reset the prerelease version', function() {
    helper.bump('--patch', {version: '1.2.3-beta.4'}, {version: '1.2.3'});
  });

  it('should not be affected by the --preid flag', function() {
    helper.bump('--patch --preid alpha', {version: '1.2.3-beta.4'}, {version: '1.2.3'});
  });
});
