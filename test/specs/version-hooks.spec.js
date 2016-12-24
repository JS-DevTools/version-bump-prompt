'use strict';

var fs = require('fs');
var path = require('path');
var helper = require('../fixtures/helper');

describe('npm version hooks', function() {
  it('should commit temp file created by version hooks', function() {
    helper.bump('--major --commit', {
      version: '1.0.0',
      scripts: {
        preversion: 'echo Hi > preversion.txt',
        version: 'echo Hi > version.txt',
        postversion: 'echo Hi > postversion.txt'
      }
    }, {
      version: '2.0.0',
      scripts: {
        preversion: 'echo Hi > preversion.txt',
        version: 'echo Hi > version.txt',
        postversion: 'echo Hi > postversion.txt'
      }
    });
    ['preversion.txt', 'version.txt', 'postversion.txt'].forEach(function (file) {
      require('chai').expect(
        fs.existsSync(path.join(__dirname, '../fixtures/.tmp/' + file)) || file + ' to exist'
      ).to.be.true;
    });
  });
});
