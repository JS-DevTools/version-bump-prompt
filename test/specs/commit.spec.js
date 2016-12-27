'use strict';

const cli = require('../fixtures/cli');
const mocks = require('../fixtures/mocks');
const files = require('../fixtures/files');
const chai = require('chai');

chai.should();

describe('bump --commit', () => {

  it('should commit the manifest file to git', () => {
    files.create('package.json', { version: '1.0.0' });

    let output = cli.exec('--major --commit');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 2.0.0',
      '✔ Git commit',
    ]);

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit package.json -m "release v2.0.0"');
  });

  it('should commit multiple manifest files to git', () => {
    files.create('package.json', { version: '1.0.0' });
    files.create('bower.json', { version: '1.0.0' });
    files.create('component.json', { version: '1.0.0' });

    let output = cli.exec('--minor --commit');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 1.1.0',
      '✔ Updated bower.json to 1.1.0',
      '✔ Updated component.json to 1.1.0',
      '✔ Git commit',
    ]);

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit package.json bower.json component.json -m "release v1.1.0"');
  });

  it('should commit all files to git', () => {
    files.create('package.json', { version: '1.0.0' });

    let output = cli.exec('--minor --commit --all');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 1.1.0',
      '✔ Git commit',
    ]);

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit -a -m "release v1.1.0"');
  });

  it('should commit the manifest files to git with a message', () => {
    files.create('package.json', { version: '1.0.0' });

    let output = cli.exec('--patch --all --commit my-message');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 1.0.1',
      '✔ Git commit',
    ]);

    let git = mocks.git();
    git.length.should.equal(1);

    git[0].cmd.should.equal('git commit -a -m "v1.0.1 my-message"');
  });

});
