#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package.json');

process.title = pkg.name;
if (!process.env.APPLICATION_ID) {
  process.env.APPLICATION_ID = 'a125d0975020cd5d594f5b940fdaae60';
}

program
  .version(pkg.name + ' version ' + pkg.version)
  .command('auth', 'wargaming.net authentication')
  .command('clans', 'clan seach and overall information')
  .command('players', 'player search and overall information')
  .command('servers', 'blitz server status')
  .command('tank-stats', 'tank statistics and achievements')
  .command('tankopedia', 'in game tank infomation')
  .parse(process.argv);

