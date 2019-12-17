import React, { Component } from 'react';
import './Mint.css';

export default class Mint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            numberTaken: false
        };
    }

    handleChange = async (event) => {
        const value = event.target.value;
        this.setState({ value, mintable: false});

        if(value && value.length > 0) {
            const mintable = await this.props.canMint(value);
            if(value === this.state.value && mintable) {
                this.setState({ mintable, numberTaken: false });
            }
            else {
                this.setState({ numberTaken: true });
            }
        }
    }

    handleMint = async (event) => {
        event.preventDefault();
        this.props.mint(this.state.value);
        this.setState({ value: '', mintable: false });
    }

    render() {
        const { value, mintable, numberTaken } = this.state;
        return (
            <div>
                {!numberTaken ? <div/> : <div className='number-taken-warning'>That number is already taken</div>}
                <form className='mint-input-container' onSubmit={this.handleMint}>
                    <input type="numeric" value={value} onChange={this.handleChange}/>
                    <button className='blockie-btn' disabled={!mintable}>Create Blockie</button>
                </form>
            </div>
        )
    }
}
