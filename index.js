'use strict';
const express = require('express');
const _ = require('lodash');

const doThing = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const clone = _.cloneDeep(xs);
  console.log('CLONE: ', clone);
  return clone
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
  // also called from the constructor

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


// App
const app = express();

app.use('/web', express.static('public'))

app.get('/', function (req, res) {
  const result = doThing('Sally');
  res.send({ keeled: false, payload: result }).status(200);
});


const gg =- 'f';






const g = 'd'

app.listen(PORT);
console.log('Running on http://localhost:' + PORT, '0.0.0.0');
