const mapFunction = require('./callbacks');
const request = require('request');
const URL = 'http://swapi.co/api/people/1'

new Promise (function(resolve, reject) {
    request(URL, { json: true }, (err, res, body,
        ) => {
      resolve(body.vehicles)
})}).then(function(value) {
    value.map(urls => mapFunction.getCars)});


