import React, { Component } from 'react';

// Components
import ConnectWallet from './ConnectWallet';
import Display from './Display/Display';

// Ethereum Items
import Web3 from 'web3';
import { abi } from '../abis/ERC721PayPerMint.json';

export default class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            walletConnected: false,
            userAccount: '',
            ethBalance: null,
            web3: {},
            contract: null,
            contractAddress: "0x38FF4cbD8968b2603935965381aBb7506D4a52e0"
        };
    }

    connectWallet = async () => {
        const { contractAddress } = this.state;

        if(window.ethereum) {
            const web3 = new Web3(Web3.givenProvider);
            const accounts = await window.ethereum.enable();
            const contract = new web3.eth.Contract(abi, contractAddress);
            await this.setState({ walletConnected: true, userAccount: accounts[0], web3, contract });
            this.getBalance(accounts[0]);
            this.handleAccountChange();
        }
        else {
            window.alert('Install Ethereum Wallet');
        }
    }

    getBalance = async (address) => {
        const { web3 } = this.state;
        if(address) {
            if(web3 !== {}) {
                const weiBalance = await web3.eth.getBalance(address);
                const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
                this.setState({ ethBalance });
            }
            else {
                window.alert('Install Ethereum Wallet');
            }
        }
        else {
            this.setState({ walletConnected: false });
        }
    }

    handleAccountChange = async () => {
        window.ethereum.on('accountsChanged', async accounts => {
            this.getBalance(accounts[0]);
            this.setState({ userAccount: accounts[0] });
        });
    }

    render() {
        const { walletConnected, userAccount, ethBalance, contract } = this.state;
        return (
            <div>
                {!walletConnected 
                ? 
                <ConnectWallet connectWallet={this.connectWallet}/> 
                : 
                <div>
                    <Display userAccount={userAccount} ethBalance={ethBalance} contract={contract}/>
                </div>}
            </div>
        )
    }
}
