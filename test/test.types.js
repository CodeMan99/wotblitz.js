var test = require('tape');
var types = require('../lib/types.js');

test('types.numbers', function types1(t) {
  t.deepEqual(types.numbers('1'), [1], 'parse one element');
  t.deepEqual(types.numbers('1,2'), [1, 2], 'parse two elements');
  t.deepEqual(types.numbers('3,4', [1, 2]), [1, 2, 3, 4], 'parse with a memo');
  t.end();
});

test('types.fields', function types2(t) {
  t.deepEqual(types.fields('one'), ['one'], 'parse one field');
  t.deepEqual(types.fields('One.two'), ['one.two'], 'parse one field, ensuring lowercase');
  t.deepEqual(types.fields('one.two,one.three'), ['one.two', 'one.three'], 'parse two fields');
  t.deepEqual(types.fields('two', ['one']), ['one', 'two'], 'parse with a memo');
  t.end();
});

test('types.modules', function types3(t) {
  t.deepEqual(types.modules('e1'), {engine: 1}, 'parse an engine id');
  t.deepEqual(types.modules('g2'), {gun: 2}, 'parse a gun id');
  t.deepEqual(types.modules('t3'), {turret: 3}, 'parse a turret id');
  t.deepEqual(types.modules('s4'), {suspension: 4}, 'parse a suspension id');
  t.deepEqual(types.modules('e1', {gun: 2}), {gun: 2, engine: 1}, 'parse with a memo');
  t.throws(types.modules.bind(null, 'e2r'), Error, 'parse error - number not at the end of the string');
  t.throws(types.modules.bind(null, 'a4'), Error, 'parse error - unknown letter');
  t.end();
});
