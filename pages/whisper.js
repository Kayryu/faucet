import fetch from 'isomorphic-unfetch'
const config = require('../frontend.config')

const location =  process.env.FAUCET_LOCATION || config.location;

export async function requestCoin(address) {
    console.log(fetch);
    let url = location + '/coin?address=' + address;
    let result;
    try {
        result = await fetch(url).then(handleResponse);
    } catch (err) {
        throw err;
    }
    return result;
}

function handleResponse(response) {
    return response.json()
        .then(json => {
            if (response.ok) {
                return json
            } else {
                return Promise.reject(json)
            }
        })
}

