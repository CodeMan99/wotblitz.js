var api = require('../config/api.json');
var app = require('../config/app.json');
var https = require('https');
var querystring = require('querystring');

module.exports = function requestExports(config) {
  return request.bind(null, api[config]);
};

function request(config, endpoint, body, callback) {
  body.application_id = app.application_id;
  body = querystring.stringify(body);

  var options = config[endpoint];

  options.hostname = config.hostname;
  options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': body.length
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
        callback(new Error(result.error.message));
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