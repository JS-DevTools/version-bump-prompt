'use strict';

const fs = require('fs');
const del = require('del');

/**
 * Clean the .tmp directory before each test
 */
beforeEach(() => {
  // Delete the .tmp directory, if it exists
  del.sync('test/.tmp');

  // Re-create the .tmp directory
  fs.mkdirSync('test/.tmp');
});
