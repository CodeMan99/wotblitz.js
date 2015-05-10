#!/usr/bin/env node

var program = require('commander');
var config = {
  api: require('./config/api.json'),
  app: require('./config/app.json'),
  pkg: require('./package.json')
};

process.title = config.pkg.name;

main(
  program
    .version('wotblitz.js version ' + config.pkg.version)
    .option('-v, --verbose', 'output more information, like debugging values')
    .parse(process.argv)
);

function main(options) {
  if (options.verbose) {
    console.log(JSON.stringify(config));
  }
}
