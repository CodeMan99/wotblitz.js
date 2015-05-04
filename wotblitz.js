#!/usr/bin/env node

var program = require('commander');
var config = {
  api: require('./config/api.json'),
  app: require('./config/app.json'),
  version: require('./package.json').version
};

main(
  program
    .version('wotblitz.js version ' + config.version)
    .option('-v, --verbose', 'output more information, like debugging values')
    .parse(process.argv)
);

function main(options) {
  if (options.verbose) {
    console.log(JSON.stringify(config));
  }
}
