import React from 'react'
import { requestCoin } from './whisper';

export default class extends React.Component {

    async receiveCoin(e) {
        e.preventDefault();
        const address = this.refs.address.value;
        if (address.length == 0) {
            return
        }
        let json = await requestCoin(address);
        console.log(json);
        alert(json.message);
    }

    render() {
        return (
            <div>
                <div>
                    <title>Ladder Network Faucet</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </div>
                <div>
                    <p>Enter your address to receive the test coin.</p>
                    <form >
                        <span>Receipt：</span>
                        <input type="text" ref="address" maxLength="66" placeholder="input address" />
                        <button onClick={this.receiveCoin.bind(this)}>领取</button>
                    </form>
                </div>
            </div>
        )
    }
}