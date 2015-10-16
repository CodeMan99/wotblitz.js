var test = require('tape');

// TODO inject lib/request.js and lib/session.js mocks
var auth = require('../bin/wotblitz-auth.js');

test('auth', function auth1(t) {
  t.equal(typeof auth, 'object', 'is an object');
  t.equal(typeof auth.login, 'function', 'login is a function');
  t.equal(typeof auth.prolongate, 'function', 'prolongate is a function');
  t.equal(typeof auth.logout, 'function', 'logout is a function');
  t.end();
});
