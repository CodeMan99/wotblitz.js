var fs = require('fs');
var fullpath;
var os = require('os');
var path = require('path');

if (typeof os.homedir !== 'function') {
  os.homedir = require('osenv').home;
}

module.exports = {
  Session: Session,
  load: load
};

function load(filename, callback) {
  if (typeof filename === 'function') {
    callback = filename;
    filename = '.wotblitz.json';
  }
  fullpath = path.resolve(os.homedir(), filename);

  fs.readFile(fullpath, 'utf8', function sessionLoadCb(err, data) {
    // report errors that are not "file does not exist"
    if (err && err.code !== 'ENOENT') return callback(err);

    data = JSON.parse(data || '{"account_id":null,"auth":null}');
    callback(null, new Session(data.account_id, data.auth));
  });
}

function Session(accountId, auth) {
  this.account_id = accountId;
  this.auth = auth;
}

Session.prototype.isLoggedIn = function isLoggedIn() {
  return this.auth !== null && this.auth.expires_at > (Date.now() / 1000);
};

Session.prototype.save = function save(callback) {
  if (typeof fullpath !== 'string') {
    return callback(new Error('session not created with the "load" function'));
  }

  fs.writeFile(fullpath, JSON.stringify(this, null, 2), 'utf8', callback);
};
