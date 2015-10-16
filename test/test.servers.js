var test = require('tape');

// TODO inject lib/request.js and lib/session.js mocks
var servers = require('../bin/wotblitz-servers.js');

test('servers', function servers1(t) {
  t.equal(typeof servers, 'object', 'is an object');
  t.equal(typeof servers.info, 'function', 'info is a function');
  t.end();
});
