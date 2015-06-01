var https = require('https');

function list() {
  var req = https.request('https://api.wotblitz.com/wotb/account/list/', function(res) {
    var data = [];
    res.setEncoding('utf8');
    res.on('data', Array.prototype.push.bind(data));
    res.on('end', function() {
      console.log(data.join(''));
    });
  });

  req.on('error', console.error);
  req.end();
}

function info() {
}

function achievements() {
}
