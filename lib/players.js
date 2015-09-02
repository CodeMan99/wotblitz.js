var https = require('https');
var querystring = require('querystring');
var config = global.config.api.account;

module.exports = {
  list: list,
  info: info,
  achievements: achievements
};

function list(search, callback) {
  var body = querystring.stringify({
    application_id: 'a125d0975020cd5d594f5b940fdaae60',
    search: search
  });

  var options = config.list;
  options.hostname = config.hostname;
  options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': body.length
  };

  request_collect(options, body, function(err, data) {
    if (err) return callback(err);

    callback(null, JSON.parse(data).data);
  });
}

function info() {
}

function achievements() {
}

function request_collect(options, body, callback) {
  var req = https.request(options, function(response) {
    var data = [];
    response.setEncoding('utf8');
    response.on('data', Array.prototype.push.bind(data));
    response.on('end', function() {
      callback(null, data.join(''));
    });
  });

  req.on('error', callback);
  req.write(body);
  req.end();
}
