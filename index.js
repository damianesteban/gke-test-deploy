'use strict';
const express = require('express');
const _ = require('lodash');

const doThing = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const clone = _.cloneDeep(xs);
  console.log('CLONE: ', clone);
  return clone
}

const doMoreThings = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const cloneValue = _.reduce(xs, (acc, x) => {
  return acc + x;
});

  console.log('CLONE: ', cloneValue);
  return cloneValue;
}
class Dude {
  #name = 'Dude';
}


class Namer {
  #name;
  #isNameSet;

  constructor(name) {
    this.#name = name;  
  }

  get name() {
    return this.#name;
  }

  get isNameSet() {
    return this.#isNameSet;
  }

  set name(name) {
    this.name = name;
    console.log('I just set this shit!');
    this.#isNameSet = true;
  }
}

const nameroo = new Namer('Balls');
console.log(nameroo.name)

// Constants
const PORT = process.env.PORT || 3000;

const name = 'd';
console.log('NAME: ', name);

console.log('OK');
// App
const app = express();

app.use('/web', express.static('public'))


app.get('/', (req, res) => {
  const result = doThing('Sally');
  const result2 = doMoreThings('Bally');
  const f = 'd';
  res.send({ keeled: 'maybe', payload: result, payload2: result2 }).status(200);
});

console.log('Running on http://localhost:' + PORT, '0.0.0.0');

const gg =- 'f';
const g = 'd'

const ggg = "fffffff";

app.listen(PORT, () => {
  console.log('Server is running on port', PORT)
});

