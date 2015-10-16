var test = require('tape');

// TODO inject lib/request.js mocks
var clans = require('../bin/wotblitz-clans.js');

test('clans', function clans1(t) {
  t.equal(typeof clans, 'object', 'clans is an object');
  t.equal(typeof clans.list, 'function', 'list is a function');
  t.equal(typeof clans.info, 'function', 'info is a function');
  t.equal(typeof clans.accountinfo, 'function', 'accountinfo is a function');
  t.equal(typeof clans.glossary, 'function', 'glossary is a function');
  t.end();
});
