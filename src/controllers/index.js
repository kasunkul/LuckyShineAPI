/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
// generate [[name, handler]] pairs
module.exports = fs
  .readdirSync(__dirname)
  .filter((file) => file !== basename)
  // eslint-disable-next-line import/no-dynamic-require
  .map((file) => [path.basename(file, '.js'), require(`./${file}`)]);
