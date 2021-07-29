'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT || 3000;

// App
const app = express();


app.use('/web', express.static('public'))

app.get('/', function (req, res) {
  res.send('Hello world\n');
});


app.listen(PORT);
console.log('Running on http://localhost:' + PORT, '0.0.0.0');