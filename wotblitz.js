#!/usr/bin/env node

var program = require('commander');
var config = {
  api: require('./config/api.json'),
  app: require('./config/app.json'),
  pkg: require('./package.json')
};

process.title = config.pkg.name;

global.config = config;
global.outputFormatter = require('./lib/outputFormatter');
var authentication = require('./lib/authentication');
var players = require('./lib/players');
var playerVehicles = require('./lib/playerVehicles');
var session = require('./lib/session');
var tankopedia = require('./lib/tankopedia');

main(
  program
    .version('wotblitz.js version ' + config.pkg.version)
    .option('-v, --verbose', 'output more information, like debugging values')
    .option('-p, --players', 'search all players')
    .parse(process.argv)
);

function main(options) {
  if (options.verbose) {
    console.log(JSON.stringify(config, null, 2));
  }
  if (options.players) {
    players.list('hello', console.log);
  }
}
