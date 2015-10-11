#!/usr/bin/env node

var program = require('commander');
var request = require('../lib/request.js')('tank-stats');
var session = require('../lib/session.js');
var types = require('../lib/types.js');
var writer = require('../lib/writer.js')({depth: 3});

module.exports = {
  stats: stats,
  achievements: achievements
};

if (require.main === module) {
  main(
    program
      .option('-s, --stats [account_id]', 'general statistics for each vehicle (endpoint)', Number)
      .option('-a, --achievements [account_id]', 'list of player\'s achievements on all vehicles (endpoint)', Number)
      .option('-t, --tank-ids <tank_ids>', 'return only the given tanks', types.fields, [])
      .option('-g, --in-garage <0|1>', 'filter by in garage or not', /^(0|1)$/i, null)
      .option('-f, --fields <fields>', 'display only the given fields', types.fields, [])
      .parse(process.argv)
  );
}

function main(opts) {
  session.load(function tankStatsSessionLoad(err, sess) {
    if (err) throw err;

    // return to avoid race conditions when saving

    if (opts.stats) return stats(opts.stats, opts.tankIds, opts.inGarage, opts.fields, sess, writer.callback);

    if (opts.achievements) {
      return achievements(
        opts.achievements,
        opts.tankIds,
        opts.inGarage,
        opts.fields,
        sess,
        writer.callback
      );
    }
  });
}

function stats(accountId, tankIds, inGarage, fields, sess, callback) {
  request('stats', {
    account_id: typeof accountId === 'number' ? accountId : sess.account_id,
    tank_id: tankIds.join(','),
    in_garage: inGarage,
    fields: fields.join(','),
    access_token: sess && sess.isLoggedIn() ? sess.auth.access_token : null
  }, callback);
}

function achievements(accountId, tankIds, inGarage, fields, sess, callback) {
  request('achievements', {
    account_id: typeof accountId === 'number' ? accountId : sess.account_id,
    tank_id: tankIds.join(','),
    in_garage: inGarage,
    fields: fields.join(','),
    access_token: sess && sess.isLoggedIn() ? sess.auth.access_token : null
  }, callback);
}