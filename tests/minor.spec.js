'use strict';

var bumpTest = require('./bump-test');

describe('bump --minor', function() {
  it('should increment a non-existent version number', function() {
    bumpTest('--minor', {}, {version: '0.1.0'});
  });

  it('should increment an all-zero version number', function() {
    bumpTest('--minor', {version: '0.0.0'}, {version: '0.1.0'});
  });

  it('should reset the patch', function() {
    bumpTest('--minor', {version: '1.2.3'}, {version: '1.3.0'});
  });

  it('should reset the prerelease version', function() {
    bumpTest('--minor', {version: '1.2.3-beta.4'}, {version: '1.3.0'});
  });

  it('should not be affected by the --preid flag', function() {
    bumpTest('--minor --preid alpha', {version: '1.2.3-beta.4'}, {version: '1.3.0'});
  });
});
