var test = require('tape');

// TODO inject config/api.json and config/app.json mock files
// TODO inject https.request mock(s)
var request = require('../lib/request.js');

test('request', function request1(t) {
  t.equal(typeof request, 'function', 'is a function');
  t.equal(typeof request('section'), 'function', 'returns a bound function');
  t.end();
});
