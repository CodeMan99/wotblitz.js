var test = require('tape');
var types = require('../lib/types.js');

test('types.numbers', function(t) {
  t.deepEqual(types.numbers('1'), [1], 'parse one element');
  t.deepEqual(types.numbers('1,2'), [1,2], 'parse two elements');
  t.end();
});

test('types.fields', function(t) {
  t.deepEqual(types.fields('one'), ['one'], 'parse one field');
  t.deepEqual(types.fields('One.two'), ['one.two'], 'parse one field, ensuring lowercase');
  t.deepEqual(types.fields('one.two,one.three'), ['one.two', 'one.three'], 'parse two fields');
  t.end();
});
