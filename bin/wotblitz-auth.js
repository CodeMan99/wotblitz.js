#!/usr/bin/env node

var childProcess = require('child_process');
var http = require('http');
var opener = require('opener2');
var program = require('commander');
var request = require('../lib/request.js')('auth');
var session = require('../lib/session.js');
var url = require('url');
var util = require('util');
var writer = require('../lib/writer.js')();

module.exports = {
  login: login,
  prolongate: prolongate,
  logout: logout
};

if (require.main === module) {
  main(
    program
      .option('-l, --login', 'login with your wargaming account (endpoint)')
      .option('-p, --prolongate', 'login will expire, extend it (endpoint)')
      .option('-q, --logout', 'revoke your current login (endpoint)')
      .option('-w, --when', 'get the date when the session expires')
      .option('-P, --port <NUM>', 'set port number for login listening [default: 8000]', Number, 8000)
      .parse(process.argv)
  );
}

function main(opts) {
  session.load(function authSessionLoad(err, sess) {
    if (err) throw err;

    // always return to only allow one request to avoid race conditions on save

    if (opts.login) return login(opts.port, sess, writer.callback);

    if (opts.prolongate) return prolongate(sess, writer.callback);

    if (opts.logout) return logout(sess, writer.callback);

    if (opts.when) return writer.write(sess.expiresAt());
  });
}

function login(port, sess, callback) {
  if (sess.isLoggedIn()) {
    return callback(new Error('already logged in, use prolongate'));
  }

  var getAuthQuery = http.createServer(function singleRequest(req, res) {
    var authQuery = url.parse(req.url, true).query;
    var html;
    var template = '<!DOCTYPE html><html lang="en-US"><head><title>Login %s' +
        '</title></head><body><h1>Login %s</h1><p>%s</p></html>';

    delete authQuery[''];
    switch (authQuery.status) {
    case 'ok':
      sess.account_id = authQuery.account_id;
      sess.auth = authQuery;
      sess.save(function loginSessionSaveCb(saveErr) {
        if (saveErr) return callback(saveErr);
        callback(null, sess);
      });

      html = util.format(template, 'Successful', 'Successful', 'You may close this tab safely.');
      break;
    case 'error':
      callback(new Error(authQuery.message));
      html = util.format(template, 'Failed', 'Failed: '.concat(authQuery.code), authQuery.message);
      break;
    default:
      // maybe a favicon.ico request, toss it regardless
      return;
    }

    res.writeHead(200, 'OK', {
      'Content-Type': 'text/html',
      'Content-Length': html.length
    });
    res.write(html);
    res.end();

    req.connection.end();
    req.connection.destroy();
    getAuthQuery.close();
  });

  getAuthQuery.listen(port);

  request('login', {
    nofollow: 1,
    redirect_uri: 'http://localhost:'.concat(port)
  }, function loginRequestCb(requestErr, data) {
    if (requestErr) {
      getAuthQuery.close();
      return callback(requestErr);
    }

    var browser = opener(data.location);

    childProcess.spawn(browser.command, browser.args, {
      detached: true,
      stdio: 'ignore'
    }).unref();
  });
}

function prolongate(sess, callback) {
  if (!sess.isLoggedIn()) return callback(new Error('must login first'));

  request('prolongate', {
    access_token: sess.auth.access_token,
    expires_at: 14 * 24 * 60 * 60 // 14 days in seconds
  }, function prolongateRequestCb(requestErr, data) {
    if (requestErr) return callback(requestErr);

    sess.auth.access_token = data.access_token;
    sess.auth.expires_at = data.expires_at.toString();
    sess.save(function prolongateSessionSaveCb(saveErr) {
      if (saveErr) return callback(saveErr);
      callback(null, sess);
    });
  });
}

function logout(sess, callback) {
  if (!sess.isLoggedIn()) return callback(null, sess);

  request('logout', {
    access_token: sess.auth.access_token
  }, function logoutRequestCb(requestErr) {
    if (requestErr) return callback(requestErr);

    sess.auth = null;
    sess.save(function logoutSessionSaveCb(saveErr) {
      if (saveErr) return callback(saveErr);
      callback(null, sess);
    });
  });
}
