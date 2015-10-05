#!/usr/bin/env node

/* eslint no-sync:0 */

var fs = require('fs');
var path = require('path');
var os = require('os');
var readline = require('readline');

// using this editor as a dependency is wrong
if (require.main !== module) process.exit(1);

// exit if global install, using repository application_id
try {
  if (!fs.statSync(path.join('..', '..', 'package.json')).isFile()) {
    process.exit(0);
  }
} catch (e) {
  if (e.code === 'ENOENT') process.exit(0);
  throw e;
}

process.stdout.write('What is your application id? ');

readline
  .createInterface({input: process.stdin})
  .once('line', saveApplicationId);

function saveApplicationId(id) {
  var appConfig = require('./config/app.json');

  appConfig.application_id = id;

  fs.writeFileSync(
    path.join('.', 'config', 'app.json'),
    JSON.stringify(appConfig, null, 2) + os.EOL,
    {encoding: 'utf8', mode: '0o664'}
  );

  this.close();
}
