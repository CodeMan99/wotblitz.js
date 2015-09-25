var test = require('tape');

// TODO inject lib/request.js and lib/session.js mocks
var players = require('../wotblitz-players');

test('players', function players1(t) {
  t.equal(typeof players, 'object', 'is an object');
  t.equal(typeof players.list, 'function', 'list is a function');
  t.equal(typeof players.info, 'function', 'info is a function');
  t.equal(typeof players.achievements, 'function', 'achievements is a function');
  t.end();
});
