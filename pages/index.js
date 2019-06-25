import React from 'react'
import { requestCoin } from './whisper';

export default class extends React.Component {
    async onHandleClick() {
        let address = '5HZEUMHMZFLN25sJw4yHCK17rtaX4qztLMnXTZVM5rbp9LmV';
        let json = await requestCoin(address);
        console.log(json);
    }
    render() {
        return (
            <div>
                <div>
                    <title>Faucet</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </div>
                <div>
                    <p>输入你的Ladder地址领取测试币.</p>
                    <p>接收地址：</p>
                    <text></text>
                    <button onClick={this.onHandleClick}>领取</button>
                </div>
            </div>
        )
    }
}