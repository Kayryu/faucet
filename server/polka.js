const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a } = require('@polkadot/util');
const config = require('../backend.config')

const url = process.env.FAUCET_URL || config.url;
const key = process.env.FAUCET_KEY || config.key;

const keyring = new Keyring();
const rich = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

const getApi = async () => {
    console.log(url);
    const provider = new WsProvider(url);
    const api = await ApiPromise.create(provider);
    return api;
}

const nativeTransfer = async (api, recipient, value) => {
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
                .signAndSend(rich, (({ events = [], status }) => {
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