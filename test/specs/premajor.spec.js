'use strict';

const cli = require('../fixtures/cli');
const files = require('../fixtures/files');
const chai = require('chai');

chai.should();

describe('bump --premajor', () => {
  it('should not increment a non-existent version number', () => {
    files.create('package.json', {});
    files.create('bower.json', { name: 'my-app' });

    let output = cli.exec('--premajor');

    output.stderr.should.be.empty;
    output.stdout.should.be.empty;
    output.status.should.equal(0);

    files.json('package.json').should.deep.equal({});
    files.json('bower.json').should.deep.equal({ name: 'my-app' });
  });

  it('should treat empty version numbers as 0.0.0', () => {
    files.create('package.json', { version: '' });
    files.create('bower.json', { version: null });
    files.create('component.json', { version: 0 });

    let output = cli.exec('--premajor');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 1.0.0-beta.0',
      '✔ Updated bower.json to 1.0.0-beta.0',
      '✔ Updated component.json to 1.0.0-beta.0',
    ]);

    files.json('package.json').should.deep.equal({ version: '1.0.0-beta.0' });
    files.json('bower.json').should.deep.equal({ version: '1.0.0-beta.0' });
    files.json('component.json').should.deep.equal({ version: '1.0.0-beta.0' });
  });

  it('should increment an all-zero version number', () => {
    files.create('package.json', { version: '0.0.0' });

    let output = cli.exec('--premajor');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 1.0.0-beta.0',
    ]);

    files.json('package.json').should.deep.equal({ version: '1.0.0-beta.0' });
  });

  it('should reset the minor and patch', () => {
    files.create('package.json', { version: '1.2.3' });

    let output = cli.exec('--premajor');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 2.0.0-beta.0',
    ]);

    files.json('package.json').should.deep.equal({ version: '2.0.0-beta.0' });
  });

  it('should reset the prerelease version', () => {
    files.create('package.json', { version: '1.2.3-beta.4' });

    let output = cli.exec('--premajor');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 2.0.0-beta.0',
    ]);

    files.json('package.json').should.deep.equal({ version: '2.0.0-beta.0' });
  });

  it('should honor the --preid flag', () => {
    files.create('package.json', { version: '1.2.3-beta.4' });

    let output = cli.exec('--premajor --preid alpha');

    output.stderr.should.be.empty;
    output.status.should.equal(0);

    output.lines.should.deep.equal([
      '✔ Updated package.json to 2.0.0-alpha.0',
    ]);

    files.json('package.json').should.deep.equal({ version: '2.0.0-alpha.0' });
  });
});
