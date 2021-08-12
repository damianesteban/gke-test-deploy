'use strict';
const express = require('express');
class Dude {
  #name = 'Dude';
}




const name = 's'
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
  res.send({ good: false }).status(200);
});



const g = 'd'

app.listen(PORT);
console.log('Running on http://localhost:' + PORT, '0.0.0.0');
