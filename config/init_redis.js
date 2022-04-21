const redis = require('redis')
const { createClient } = require('redis');

const client = createClient();
(async () => {

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    client.on('connect', () => {
        console.log('Client connected to redis...')
    })
    await client.set('key11', 'value11');
    const value = await client.get('key11');
    console.log(value);
})();

module.exports = client

