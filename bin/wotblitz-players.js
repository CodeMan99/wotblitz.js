#!/usr/bin/env node

var program = require('commander');
var request = require('../lib/request.js')('players');
var session = require('../lib/session.js');
var types = require('../lib/types.js');
var writer = require('../lib/writer.js')({depth: 4});

module.exports = {
  list: list,
  info: info,
  achievements: achievements
};

if (require.main === module) {
  main(
    program
      .option('-s, --search <name>', 'search for a player (endpoint)')
      .option('-i, --info [account_id]', 'player details (endpoint)', types.numbers)
      .option('-a, --achievements [account_id]', 'achievement details (endpoint)', types.numbers)
      .option('-e, --extra', 'extra field(s) for player details')
      .option('-f, --fields <fields>', 'the fields to select of the endpoint', types.fields, [])
      .option('--no-save', 'turn off saving account_id when search returns one item')
      .parse(process.argv)
  );
}

function main(opts) {
  session.load(function playersSessionLoad(err, sess) {
    if (err) throw err;

    // always return to only allow one request to avoid race conditions on save

    if (opts.search) return list(opts.search, opts.save ? sess : null, writer.callback);

    if (opts.info) {
      return info(opts.info, opts.extra ? ['private.grouped_contacts'] : [], opts.fields, sess, writer.callback);
    }

    if (opts.achievements) return achievements(opts.achievements, sess, writer.callback);
  });
}

function list(search, sess, callback) {
  request('list', {
    search: search
  }, function listRequestCb(err, data) {
    if (!sess) return callback(err, data);
    if (err) return callback(err);
    if (data.length !== 1) return callback(null, data);

    sess.account_id = data[0].account_id;
    sess.save(function searchSessionSaveCb(saveErr) {
      if (saveErr) return callback(saveErr);
      callback(null, data, sess);
    });
  });
}

function info(accountIds, extra, fields, sess, callback) {
  request('info', {
    account_id: Array.isArray(accountIds) ? accountIds.join(',') : sess.account_id,
    extra: extra.join(','),
    fields: fields.join(','),
    access_token: sess && sess.isLoggedIn() ? sess.auth.access_token : null
  }, callback);
}

function achievements(accountIds, sess, callback) {
  request('achievements', {
    account_id: Array.isArray(accountIds) ? accountIds.join(',') : sess.account_id
  }, callback);
}
