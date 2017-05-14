import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    Col,
    ControlLabel,
    FormControl,
    Button,
    FormGroup
} from 'react-bootstrap';
import axios from 'axios';


const nodeURL = "http://bob.nem.ninja:7890/transaction/announce";

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedTransaction: ""
        };
    }
    handleInputChange(e) {
        var target = e.target;
        var name = target.name;
        var value = target.value;

        this.setState({
            [name]: value
        })

    }
    broadcastTransaction() {
        //Post the transaction
        var st = JSON.parse(this.state.signedTransaction);
        var config = {
            // `headers` are custom headers to be sent
            headers: { 'Content-Type': 'application/json' },
        }
        axios.post(nodeURL, st, config)
            .then((response) => {
                console.log(response);
            }).catch((error) => {
                var obj = error.response.data;
                console.log(obj);
            })
    }
    render() {
        return (
            <div className="details-container">
                <Col xs={6} md={6} className="form-container">
                    <FormGroup controlId="">
                        <ControlLabel>Signed Transaction</ControlLabel>
                        <FormControl name="signedTransaction" componentClass="textarea" placeholder="Paste the signed transaction" onChange={this.handleInputChange.bind(this)} />
                    </FormGroup>
                    <Button bsStyle="success" onClick={this.broadcastTransaction.bind(this)} >
                        Broadcast transaction
                    </Button>
                </Col>
            </div>
        );

    }

}

export default Details;