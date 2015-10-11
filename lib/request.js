var api = require('../config/api.json');
var appId = process.env.APPLICATION_ID;
var https = require('https');
var querystring = require('querystring');
var util = require('util');

module.exports = function requestExports(config) {
  return request.bind(null, api[config]);
};

function request(config, endpoint, body, callback) {
  body.application_id = appId;
  body = querystring.stringify(body);

  var options = {
    hostname: config.hostname,
    path: config[endpoint].path,
    method: config[endpoint].method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    }
  };

  var req = https.request(options, function httpsRequestCb(response) {
    var data = [];

    response.setEncoding('utf8');
    response.on('data', Array.prototype.push.bind(data));
    response.on('end', function httpsRequestEndCb() {
      var result = JSON.parse(data.join('') || '{}');

      switch (result.status) {
      case 'ok':
        callback(null, result.data);
        break;
      case 'error':
        var errorFormat = util.format(
          '%d %s: %s=%j',
          result.error.code,
          result.error.message,
          result.error.field,
          result.error.value
        );

        callback(new Error(errorFormat));
        break;
      default:
        callback(null, null);
        break;
      }
    });
  });

  req.once('error', callback);
  req.write(body);
  req.end();
}
