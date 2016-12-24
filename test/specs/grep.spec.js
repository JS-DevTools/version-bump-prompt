'use strict';

var helper = require('../fixtures/helper');

describe('bump --grep', function() {
  it('should replace the major version number in non-manifest files', function() {
    helper.bump('--major --grep LICENSE README.* *.js', {version: '1.2.3'}, {version: '2.0.0'});
  });

  it('should replace the minor version number in non-manifest files', function() {
    helper.bump('--minor --grep LICENSE README.* *.js', {version: '1.2.3'}, {version: '1.3.0'});
  });

  it('should replace the patch version number in non-manifest files', function() {
    helper.bump('--patch --grep LICENSE README.* *.js', {version: '1.2.3'}, {version: '1.2.4'});
  });

  it('should replace the premajor version number in non-manifest files', function() {
    helper.bump('--premajor --grep LICENSE README.* *.js', {version: '1.2.3'}, {version: '2.0.0-beta.0'});
  });

  it('should replace the preminor version number in non-manifest files', function() {
    helper.bump('--preminor --grep LICENSE README.* *.js', {version: '1.2.3'}, {version: '1.3.0-beta.0'});
  });

  it('should replace the prepatch version number in non-manifest files', function() {
    helper.bump('--prepatch --grep LICENSE README.* *.js', {version: '1.2.3'}, {version: '1.2.4-beta.0'});
  });

  it('should replace the prerelease version number in non-manifest files', function() {
    helper.bump('--prerelease --grep LICENSE README.* *.js', {version: '1.2.3'}, {version: '1.2.4-beta.0'});
  });
});
