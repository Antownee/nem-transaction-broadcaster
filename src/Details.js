import React, { Component } from 'react';
import {
    Col,
    ControlLabel,
    FormControl,
    Button,
    FormGroup
} from 'react-bootstrap';
import axios from 'axios';
import Halogen from 'halogen';


const nodeURL = "http://nkbase.ronel.li:6890/transaction/announce";



class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedTransaction: "",
            currentDiv: 0,
            returnMessage: "",
            result: ["success", "Success!"]
        };
    }
    handleInputChange(e) {
        var target = e.target;
        var name = target.name;
        var value = target.value;

        this.setState({
            [name]: value
        });

    }
    broadcastTransaction() {
        //Post the transaction

        //Show loader
        this.setState({
            currentDiv: 1
        });

        var st = JSON.parse(this.state.signedTransaction);
        var config = {
            headers: { 'Content-Type': 'application/json' },
        }

        axios.post(nodeURL, st, config)
            .then((response) => {
                if (response.data.message === "SUCCESS") {
                    //Load successful message
                    //response.data.transactionHash.data
                    this.setState({
                        currentDiv: 2,
                        returnMessage: response.data.transactionHash.data,
                        result: ["success", "Success!"]
                    });
                } else {
                    this.setState({
                        currentDiv: 2,
                        returnMessage: "An error occured. Try again",
                        result: ["danger", "Error!"]
                    });
                }
            }).catch((error) => {
                this.setState({
                    currentDiv: 2,
                    returnMessage: error.message,
                    result: ["danger", "Error!"]
                });
            });
    }
    closeSuccess() {
        this.setState({
            currentDiv: 0
        });
    }
    render() {
        var mainDiv = (
            <div className="details-container">
                <Col xs={6} md={6} className="form-container">
                    <FormGroup>
                        <ControlLabel>Signed Transaction</ControlLabel>
                        <FormControl name="signedTransaction" id="signedTransaction" componentClass="textarea" placeholder="Paste the signed transaction" onChange={this.handleInputChange.bind(this)} />
                    </FormGroup>
                    <Button bsStyle="success" onClick={this.broadcastTransaction.bind(this)} >
                        Broadcast transaction
                    </Button>
                </Col>
            </div>
        );

        if (this.state.currentDiv === 0) {
            return mainDiv
        } else if (this.state.currentDiv === 1) {
            //Loader
            return <Loader />
        } else if (this.state.currentDiv === 2) {
            return <Success message={this.state.returnMessage} closeDiv={this.closeSuccess.bind(this)} result={this.state.result} />;
        }
    }
}

var ldrstyle = {
    display: '-webkit-flex',
    WebkitFlex: '0 1 auto',
    flex: '0 1 auto',
    WebkitFlexDirection: 'column',
    flexDirection: 'column',
    WebkitFlexGrow: 1,
    flexGrow: 1,
    WebkitFlexShrink: 0,
    flexShrink: 0,
    WebkitFlexBasis: '25%',
    flexBasis: '25%',
    height: '200px',
    WebkitAlignItems: 'center',
    alignItems: 'center',
    WebkitJustifyContent: 'center',
    justifyContent: 'center'
};
const ldrColor = '#00c4b3';

const wellStyles = { maxWidth: 800, margin: '50px auto 10px', padding: '50px' };
const pStyle = { margin: '20px 0px' };

const Success = (props) =>
    <div className="well" style={wellStyles}>
        <Button bsStyle={props.result[0]} bsSize="large" block onClick={props.closeDiv}>{props.result[1]}</Button>
        <p style={pStyle}>{props.message}</p>
    </div>



const Loader = () =>
    <div style={ldrstyle}>
        <Halogen.PulseLoader color={ldrColor} />
    </div>

export default Details;