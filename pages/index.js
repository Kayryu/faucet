import React from 'react'

export default class extends React.Component {

    onHandleClick() {
        console.log('链接被点击');
    }
    render() {
        return (
            <div>
                <div>
                    <title>My page title</title>
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