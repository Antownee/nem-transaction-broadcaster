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


const nodeURL = "http://nkbase.ronel.li:6890/transaction/announce";

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedTransaction: "",
            successDiv: false,
            successMessage: ""
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
                if (response.data.message === "SUCCESS") {
                    //Load successful message
                    //response.data.transactionHash.data
                    this.setState({
                        successDiv: true,
                        successMessage: response.data.transactionHash.data
                    });
                }
            }).catch((error) => {
                var obj = error.response.data;
                console.log(obj);
            });
    }
    closeSuccess(){
        this.setState({
            successDiv: false
        });
    }
    render() {
        var mainDiv = (
            <div className="details-container">
                <Col xs={6} md={6} className="form-container">
                    <FormGroup controlId="">
                        <ControlLabel>Signed Transaction</ControlLabel>
                        <FormControl name="signedTransaction" id="signedTransaction" componentClass="textarea" placeholder="Paste the signed transaction" onChange={this.handleInputChange.bind(this)} />
                    </FormGroup>
                    <Button bsStyle="success" onClick={this.broadcastTransaction.bind(this)} >
                        Broadcast transaction
                    </Button>
                </Col>
            </div>
        );
        if (!this.state.successDiv){
            return mainDiv
        } else {
            return <Success message={this.state.successMessage} closeDiv={this.closeSuccess.bind(this)}/>;
        }
    }

}

const wellStyles = { maxWidth: 400, margin: '50px auto 10px', padding: '50px' };
const pStyle = { margin: '20px 0px'};

const Success = (props) => 
    <div className="well" style={wellStyles}>
        <Button bsStyle="success" bsSize="large" block onClick={props.closeDiv}>Success!</Button>
        <p style={pStyle}>{props.message}</p>
    </div>


export default Details;