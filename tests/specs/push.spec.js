'use strict';

var helper = require('../fixtures/helper');

describe('bump --push', function() {
  it('should push to git', function() {
    helper.bump('--major --push', {version: '1.0.0'}, {version: '2.0.0'});
    helper.git([
      ['commit', 'package.json', 'bower.json', 'component.json', '-m', 'release v2.0.0'],
      ['push']
    ])
  });

  it('should push git tags', function() {
    helper.bump('--premajor --tag --push', {version: '1.0.0'}, {version: '2.0.0-beta.0'});
    helper.git([
      ['commit', 'package.json', 'bower.json', 'component.json', '-m', 'release v2.0.0-beta.0'],
      ['tag', 'v2.0.0-beta.0'],
      ['push'],
      ['push', '--tags']
    ])
  });
});
