"use strict";
const express = require("express");
const _ = require("lodash");
const { store } = require("./db");
const u = require("underscore");


const yy = 'uuu';
console.log(yy);
const doThing = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const clone = _.cloneDeep(xs);
  return clone;
};


const doMoreThings = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const reduction = _.reduce(xs, (acc, x) => acc + x);
  return reduction;
};

const doEvenMoreThings = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const compacted = _.compact(xs);
  return compacted;
};

const doOneFinalThing = (name) => {
  const xs = [1, 2, 3, 4, 5, name];
  const chunked = u.chunk(xs, 2);
  return chunked;
};

const make = () => ({
  name: "John",
  age: 25,
});


const PORT = 5000;

const app = express();

app.use("/web", express.static("public"));


app.get("/", (_, res) => {
  const result = doThing("Sally");
  const result2 = doMoreThings("Cally");
  const result3 = doEvenMoreThings("Dally");
  const result4 = doOneFinalThing("Gally");
  const compositeResult = [result, result2, result3, result4];

  // This is example of how you can use the store to save data
  store.data = compositeResult;

  res.send({ data: store.data, make: make() }).status(200);
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
