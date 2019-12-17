import React, { Component } from 'react'

export default class Transfer extends Component {
    constructor() {
        super();

        this.state = {
            tokenId: 0,
            recipientAddress: ''
        }
    }

    componentDidMount() {
        console.log(this.props.contract)
    }

    handleTransfer = (event) => {
        event.preventDefault();
        const { recipientAddress, tokenId } = this.state;
        this.props.sendNFT(recipientAddress, tokenId);
    }

    handleChange = async (event) => {
        const value = event.target.value;
        const name = event.target.name
        this.setState({ [name]: value });
    }

    render() {
        const { recipientAddress, tokenId } = this.state;
        return (
            <div>
                <form onSubmit={this.handleTransfer} className='mint-input-container'>
                    <input type='text' 
                        name='recipientAddress' 
                        value={recipientAddress} 
                        onChange={this.handleChange}
                    />
                    <input type='numeric' 
                        name='tokenId' 
                        value={tokenId} 
                        onChange={this.handleChange}
                    />
                    <button className='blockie-btn'>Send Blockie</button>
                </form>
            </div>
        )
    }
}
