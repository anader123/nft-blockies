import React, { Component } from 'react';
import Mint from '../Mint/Mint';
import BN from 'bignumber.js';
import blockies from 'ethereum-blockies-png';
import './Display.css';
import Transfer from '../Transfer';


export default class Display extends Component {
    constructor(props) { 
        super(props);

        this.state = {
            tokens: [],
            loading: true,
            mint: true
        };
    }


    async componentDidMount() {
        const tokenIds = await this.getTokens();
        const tokens = tokenIds.map(id => ({ id, confirmed: true }));
        this.setState({ tokens, loading: false });
        this.handleAccountChange();
    }

    handleAccountChange = async () => {
        window.ethereum.on('accountsChanged', async accounts => {
            const tokenIds = await this.getTokens();
            const tokens = tokenIds.map(id => ({ id, confirmed: true }));
            this.setState({ tokens, loading: false });
        });
    }

    mint = async (id) => {
        const { contract, userAccount } = this.props;
        const value = new BN(id).shiftedBy(12).toString(10);
        contract.methods.mint(userAccount, id).send({ value, from: userAccount })
            .on('receipt', () => {
                this.setState(state => ({
                    ...state,
                    tokens: [ ...state.tokens, { id }]
                }))
            })
            .on('error', error => {
                window.alert('Error');
                console.log(error);
            })
    }

    canMint = async (id) => {
        const { contract } = this.props;
        const exists = await contract.methods.exists(id).call();
        return !exists;
    }

    sendNFT = (recipientAddress, tokenId) => {
        const { contract, userAccount } = this.props;
        const { tokens } = this.state;
        const strTokenId = tokenId.toString();
        console.log(userAccount, recipientAddress, strTokenId)
        if(tokenId > 0 && recipientAddress.length === 42) {
            contract.methods.safeTransferFrom(userAccount, recipientAddress, strTokenId).send( {from: userAccount} )
            .on('receipt', (receipt) => {
                const newTokens = tokens.filter(token => token.id !== tokenId);
                this.setState({ tokens: newTokens });
            })
            .on('error', (error) => {
                console.log(error);
            })
        }
    }

    getTokens = async () => {
        const { userAccount, contract } = this.props;
        const strBalance = await contract.methods.balanceOf(userAccount).call();
        const balance = parseInt(strBalance);

        const queries = Array.from({ length: balance }, (_,index) => (
        contract.methods.tokenOfOwnerByIndex(userAccount, index).call()
        ));
        return await Promise.all(queries); 
    }

    mintToggle = (bool) => {
        this.setState({ mint: bool });
    }

    render() {
        const { userAccount, ethBalance, contract } = this.props;
        const { tokens, loading, mint } = this.state;
        if(loading) return <div>Loading...</div>;
        return (
            <div className='display-container'>
                <div className='user-info-container'>
                    <p>Address: {userAccount}</p>
                    <p>Number of Blockies: {tokens.length}</p>
                    <p>Eth Balance: {ethBalance}</p>
                </div>

                <h4 className='my-blockies-text'>My Blockies</h4>

                <div className='blockies-container'>
                    { tokens.map(token => (
                        <div className='blockie' key={token.id.toString()}>
                            <img className='blockie-img' src={blockies.createDataURL({seed: (token.id * 50000).toString()})} alt='nft-blockie'/>
                            <p className='token-id'>Token ID: {token.id.toString()}</p>
                        </div>
                    ))}
                </div>
                <div className='mint-transfer-toggle'>
                    <h2 onClick={() => this.mintToggle(true)}>Mint</h2>
                    <h2 onClick={() => this.mintToggle(false)}>Transfer</h2>
                </div>
                {mint ? 
                <Mint canMint={this.canMint} mint={this.mint}/>
                :
                <Transfer userAccount={userAccount} contract={contract} sendNFT={this.sendNFT}/>
                }
            </div>
        )
    }
}
