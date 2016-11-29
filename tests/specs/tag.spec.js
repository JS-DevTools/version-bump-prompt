'use strict';

var helper = require('../fixtures/helper');

describe('bump --tag', function() {
  it('should add a git tag', function() {
    helper.bump('--major --tag --commit', {version: '1.0.0'}, {version: '2.0.0'});
    helper.git([
      ['commit', 'package.json', 'bower.json', 'component.json', '-m', 'release v2.0.0'],
      ['tag', '-a', 'v2.0.0', '-m', '2.0.0']
    ])
  });

  it('should add a git tag, even if --commit is not specified', function() {
    helper.bump('--minor --tag', {version: '1.0.0'}, {version: '1.1.0'});
    helper.git([
      ['commit', 'package.json', 'bower.json', 'component.json', '-m', 'release v1.1.0'],
      ['tag', '-a', 'v1.1.0', '-m', '1.1.0']
    ])
  });

  it('should tag all files', function() {
    helper.bump('--patch --tag --all', {version: '1.0.0'}, {version: '1.0.1'});
    helper.git([
      ['commit', '-a', '-m', 'release v1.0.1'],
      ['tag', '-a', 'v1.0.1', '-m', '1.0.1']
    ])
  });

  it('should push git tags', function() {
    helper.bump('--premajor --tag --push', {version: '1.0.0'}, {version: '2.0.0-beta.0'});
    helper.git([
      ['commit', 'package.json', 'bower.json', 'component.json', '-m', 'release v2.0.0-beta.0'],
      ['tag', '-a', 'v2.0.0-beta.0', '-m', '2.0.0-beta.0'],
      ['push'],
      ['push', '--tags']
    ])
  });
});
