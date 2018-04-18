'use strict';

const cli = require('../fixtures/cli');
const files = require('../fixtures/files');
const check = require('../fixtures/check');
const chai = require('chai');

chai.should();

describe('bump --lock', () => {
  it('should not increment lock file by default', () => {
    files.create('package-lock.json', { version: '1.0.0' });

    let output = cli.exec('--patch');

    output.stderr.should.be.empty;
    output.stdout.should.be.empty;
    output.status.should.equal(0);

    files.json('package-lock.json').should.deep.equal({ version: '1.0.0' });
  });

  it('should increment version when lock option is provided', () => {
    files.create('package-lock.json', { version: '0.0.0' });

    let output = cli.exec('--patch --lock');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      `${check} Updated package-lock.json to 0.0.1`,
    ]);

    files.json('package-lock.json').should.deep.equal({ version: '0.0.1' });
  });
});
