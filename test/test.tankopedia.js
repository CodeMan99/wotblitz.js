var test = require('tape');

// TODO inject lib/request.js and lib/session.js mocks
var tankopedia = require('../bin/wotblitz-tankopedia.js');

test('tankopedia', function tankopedia1(t) {
  t.equal(typeof tankopedia, 'object', 'is an object');
  t.equal(typeof tankopedia.vehicles, 'function', 'vehicles is a function');
  t.equal(typeof tankopedia.characteristics, 'function', 'characteristics is a function');
  t.equal(typeof tankopedia.characteristic, 'function', 'characteristic is a function');
  t.equal(typeof tankopedia.modules, 'function', 'modules is a function');
  t.equal(typeof tankopedia.provisions, 'function', 'provisions is a function');
  t.equal(typeof tankopedia.info, 'function', 'info is a function');
  t.end();
});
