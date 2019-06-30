const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a } = require('@polkadot/util');
const config = require('../backend.config')

const url = config.url;

const getApi = async () => {
    console.log(url);
    const provider = new WsProvider(url);
    const api = await ApiPromise.create(provider);
    return api;
}

const nativeTransfer = async (api, key, recipient, value) => {
    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    // check format of recipient
    try {
        keyring.decodeAddress(recipient);
    } catch(e) {
        throw 'Invalid decoded address length';
    }
    
    let doWithListener = () => {
        return new Promise(function (resolve, reject) {
            api.tx.balances
                .transfer(recipient, value)
                .signAndSend(from, (({ events = [], status }) => {
                    if (status.isFinalized) {
                        let fets = events.map(({ phase, event: { data, method, section } }) => {
                            return {
                                section: section,
                                method: method,
                                data: data.toString(),
                            }
                        });
                        console.log(fets);

                        let item = fets.find((event) => {return(event.section === 'system' && event.method === 'ExtrinsicSuccess');});
                        resolve(item ? 'Succeed': 'Failed');
                    }
                })).catch(err => {
                    reject("transfer error.");
                });
        });
    }
    return doWithListener();
}

module.exports = {
    nativeTransfer,
    getApi
}