var test = require('tape');
var fs = require('fs');
var session = require('../lib/session.js');

test('Session.prototype.isLoggedIn', function session1(t) {
  var sess = new session.Session(null, null);

  t.equal(sess.isLoggedIn(), false, 'a null session is not logged in');

  sess.auth = {};
  sess.auth.expires_at = (Date.now() / 1000) - 1;

  t.equal(sess.isLoggedIn(), false, 'an expired session is not logged in');

  sess.auth.expires_at = (Date.now() / 1000) + 10;

  t.equal(sess.isLoggedIn(), true, 'session is logged in');

  t.end();
});

test('unloaded Session.prototype.save', function session2(t) {
  var sess = new session.Session(null, null);

  sess.save(function testSessionSave2(err) {
    t.equal(
      err.message,
      'session not created with the "load" function',
      'session required to be loaded'
    );

    t.end();
  });
});

test('session.load, no file', function session3(t) {
  fs.unlink('/tmp/wotblitz.json', function remove() {
    session.load('/tmp/wotblitz.json', function testSessionLoad3(err, sess) {
      t.error(err, 'session load should not errer even if there is not a file');
      t.equal(sess.auth, null, 'sess.auth should be null without a file');
      t.equal(sess.account_id, null, 'sess.account_id should be null without a file');
      t.end();
    });
  });
});

test('loaded Session.prototype.save', function session4(t) {
  session.load('/tmp/wotblitz.json', function testSessionLoad4(err, sess) {
    sess.save(function testSessionSave4(saveErr) {
      t.error(saveErr, 'save writes a file when in a loaded session');
      t.end();
    });
  });
});

test('Session.prototype.expiresAt', function session5(t) {
  var sess = new session.Session(null, null);

  t.throws(sess.expiresAt, Error, 'a null session throws an error');

  sess.auth = {};
  sess.auth.expires_at = 1;

  // using timespan because `new Date(1000) === new Date(1000)` is false?
  t.equal(sess.expiresAt() - new Date(1000), 0, 'a set session has definite expiration');

  t.end();
});
