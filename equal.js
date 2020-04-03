function assertEqual(left, right) {
  console.log(left, left == right ? 'equals' : 'is not equal to', right);
}

function assertExact(left, right) {
  console.log(left, left === right ? 'equals' : 'is not equal to', right);
}

const n12 = 12;
const s12 = '12';

assertEqual(s12, n12);
assertExact(s12, n12);
