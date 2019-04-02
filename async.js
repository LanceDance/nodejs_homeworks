const request = require('request-promise');
const URL = 'http://swapi.co/api/people/1';

async function main() {
    try {
        const result = await request(URL, { json: true });
        let vehicles = result.vehicles;
        let arrayOfObjects = await Promise.all(vehicles.map(async url => await request(url, { json: true })));
        for(var i = 0; i < arrayOfObjects.length; i++) {
            console.log(arrayOfObjects[i].name);
        };
    } catch (e) {
        console.log(e.message);
    }
    
}
main();
