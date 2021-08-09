'use strict';
const { from } = require('rxjs');
const express = require('express');
class Namer {
  #name;
  #isNameSet;

  constructor(name) {
    this.#name = name;  
  }

  get name() {
    return this.#name;
  }

  set name() {
    this.#isNameSet = true;
  }
}

const nameroo = new Namer('Balls');
console.log(nameroo.name)


// comment
// Constants
const PORT = process.env.PORT || 3000;










const name = 'd';



// App
const app = express();


app.use('/web', express.static('public'))

app.get('/', function (req, res) {
  const xs = from(['a', 'b', 'c']).subscribe(x => res.send(x));
  return xs;
});






app.listen(PORT);
console.log('Running on http://localhost:' + PORT, '0.0.0.0');
