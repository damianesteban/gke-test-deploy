'use strict';
const express = require('express');
const _ = require('lodash');
const { store } = require('./db');
const u = require('underscore');

const doThing = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const clone = _.cloneDeep(xs);
  return clone
}

const doMoreThings = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const reduction = _.reduce(xs, (acc, x) => {
    return acc + x;
  });
  return reduction;
}

const doEvenMoreThings = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const compacted = _.compact(xs);
  return compacted;
}

const doOneFinalThing = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const chunked = u.chunk(xs, 2);
  return chunked;
}

// Constants
const PORT = process.env.PORT || 3000;

const app = express();

app.use('/web', express.static('public'))

const make = () => {
  return {
    name: 'John',
    age: 25,
  }
}


app.get('/', (req, res) => {
  const result = doThing('Sally');
  const result2 = doMoreThings('Bally');
  const result3 = doEvenMoreThings('Bally');
  const result4 = doOneFinalThing('Cally');
  const compositeResult = [result, result2, result3, result4];
  store.data = compositeResult;
  console.log(make())
  res.send({ data: store.data }).status(200);
});

const ff = '4';
const hh = 'gg';
console.log(ff);
console.log(hh);
console.log('Running on http://localhost:' + PORT, '0.0.0.0');

app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
});

