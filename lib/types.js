module.exports = {
  fields: fields,
  modules: modules,
  numbers: numbers
};

function fields(val, memo) {
  return (memo || []).concat(
    val
      .split(',')
      .map(function fieldToLowerCase(s) {
        return s.toLowerCase();
      })
  );
}

function modules(val, memo) {
  var letter = val[0].toLowerCase();
  var idResult = val.match(/[0-9]+$/);

  if (!idResult) throw new Error('module id not found');

  var id = Number(idResult[0]);

  memo = memo || {};

  switch (letter) {
  case 'e':
    memo.engine = id;
    break;
  case 't':
    memo.turret = id;
    break;
  case 'g':
    memo.gun = id;
    break;
  case 's':
    memo.suspension = id;
    break;
  default:
    throw new Error('Unknown module selection');
  }

  return memo;
}

function numbers(val, memo) {
  return (memo || []).concat(
    val
      .split(',')
      .map(Number)
  );
}
