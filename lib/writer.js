module.exports = function setOptions(options) {
  options = options || {colors: true, indent: 2};

  return {
    write: callback.bind(options),
    writeSync: callback.bind(options, null)
  };
};

function callback(err, data) {
  if (err) throw err;

  if (process.stdout.isTTY) {
    console.dir(data, this);
  } else {
    console.log(JSON.stringify(data, this.replacer, this.indent));
  }
}
