module.exports = {
  numbers: numbers,
  fields: fields
};

function numbers(val) {
  return val
    .split(',')
    .map(Number);
}
function fields(val) {
  return val
    .split(',')
    .map(function fieldToLowerCase(s) {
      return s.toLowerCase();
    });
}
