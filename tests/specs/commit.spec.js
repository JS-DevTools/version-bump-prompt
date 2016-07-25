'use strict';

var helper = require('../fixtures/helper');

describe('bump --commit', function() {
  it('should commit the manifest files to git', function() {
    helper.bump('--major --commit', {version: '1.0.0'}, {version: '2.0.0'});
    helper.git([
      'commit package.json bower.json component.json -m "release v2.0.0"'
    ])
  });

  it('should commit all files to git', function() {
    helper.bump('--minor --commit --all', {version: '1.0.0'}, {version: '1.1.0'});
    helper.git([
      'commit -a -m "release v1.1.0"'
    ])
  });

  it('should commit the manifest files to git with a message', function() {
    helper.bump('--patch --all --commit my-message', {version: '1.0.0'}, {version: '1.0.1'});
    helper.git([
      'commit -a -m "v1.0.1 my-message"'
    ])
  });

});
