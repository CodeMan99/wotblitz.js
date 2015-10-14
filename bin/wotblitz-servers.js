#!/usr/bin/env node

var request = require('../lib/request.js')('servers');
var writer = require('../lib/writer.js')();

module.exports = {
  info: info
};

if (require.main === module) {
  // hook up commander for the help chain
  require('commander').parse(process.argv);

  info(writer.callback);
}

function info(callback) {
  request('info', {
    game: 'wotb'
  }, function infoRequestCb(err, data) {
    if (err) return callback(err);
    callback(null, data.wotb);
  });
}
