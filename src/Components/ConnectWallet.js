import React from 'react'

export default function ConnectWallet(props) {
    const { connectWallet } = props;

    return (
        <div className='connect-wallet-container'>
            <p className='connect-text'>NTF Blockies are one of a kind NTFs. You can get your own by entering in a number and then paying a small amount of ether and receive your own.</p>
            <button className='blockie-btn' onClick={connectWallet}>Connect Wallet</button>
        </div>
    )
}
