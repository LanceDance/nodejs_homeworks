const getCars = require('./project_1');
const request = require('request');
const URL = 'http://swapi.co/api/people/1'

let promise1 = new Promise (function(resolve, reject) {
    request(URL, { json: true }, (err, res, body,
        ) => {
      resolve(body.vehicles)
})});

promise1.then(function(value) {
value.map(urls => getCars)})
