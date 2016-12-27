'use strict';

const chalk = require('chalk');
const logSymbols = require('log-symbols');

// Export the check symbol (✔ on Mac/Linux, √ on Windows)
// with the ANSI color sequences removed
module.exports = chalk.stripColor(logSymbols.success);
