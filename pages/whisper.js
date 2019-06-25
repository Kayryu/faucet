import fetch from 'isomorphic-unfetch'
const { config } = require('../config')

const location = config.location;

export async function requestCoin(address) {
    console.log(fetch);
    let url = location + '/coin?address=' + address;
    let result = await fetch(url).then(handleResponse);
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

