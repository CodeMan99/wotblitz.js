module.exports = function createWriter(options) {
  return new Writer(options);
};

function Writer(options) {
  this.colors = true;
  this.indent = 2;

  for (var k in options) this[k] = options[k];

  this.write = write.bind(this);
  this.writeSync = write.bind(this, null);
}

function write(err, data) {
  if (err) throw err;

  if (process.stdout.isTTY) {
    console.dir(data, this);
  } else {
    console.log(JSON.stringify(data, this.replacer, this.indent));
  }
}
