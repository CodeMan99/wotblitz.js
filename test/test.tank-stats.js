var test = require('tape');

// TODO inject lib/request.js and lib/session.js mocks
var tankStats = require('../bin/wotblitz-tank-stats.js');

test('tank-stats', function tankStats1(t) {
  t.equal(typeof tankStats, 'object', 'is an object');
  t.equal(typeof tankStats.stats, 'function', 'stats is a function');
  t.equal(typeof tankStats.achievements, 'function', 'achievements is a function');
  t.end();
});
