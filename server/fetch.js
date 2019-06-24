const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a } = require('@polkadot/util');

const getApi = async (url) => {
    const provider = new WsProvider(url);
    const api = await ApiPromise.create(provider);
    return api;
}

const nativeTransfer = async (url, key, recipient, value) => {
    //TODO verify key and recipient.
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    let doWithListener = () => {
        return new Promise(function (resolve, reject) {
            api.tx.balances
                .transfer(recipient, value)
                .signAndSend(from, (({ events = [], status }) => {
                    if (status.isFinalized) {
                        let result = "";
                        events.forEach(({ phase, event: { data, method, section } }) => {
                            result += '\t' + phase.toString() + `: ${section}.${method}` + data.toString();
                        });
                        resolve(result);
                    }
                })).catch(err => {
                    reject("transfer error.");
                });
        });
    }
    return doWithListener();
}

module.exports = {
    nativeTransfer
}