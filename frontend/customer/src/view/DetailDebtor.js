import React from 'react';
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import store from '../store/init.js'
import axios from 'axios';
import Config from '../config/config';

class DetailDebtor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bank_number:"",
      bank_name:"",
      bank_account_name:"",
      amount:"",
      message:"",
      otp:"",
      showOTP:false,
      transaction_id: 0,
      feeForMe:true,
    };
    this.render = this.render.bind(this);
    this.handleDebtorChange = this.handleDebtorChange.bind(this);
    this.handleClickSend = this.handleClickSend.bind(this);
    this.handleCloseOTP = this.handleCloseOTP.bind(this);
    this.handleClickSendOTP = this.handleClickSendOTP.bind(this);
  }
  handleCloseOTP() {
    this.setState({showOTP: false})
  }
  handleClickSendOTP() {
    axios({
      method:`post`,
      url:`${Config.BEUrl}/v1/accounts/${this.state.bank_number}/transfer/otp`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
      data: {
        transaction_id: this.state.transaction_id,
        otp: this.state.otp,
      },
    })
      .then(resp => {
        this.handleCloseOTP()
        console.log(resp)
      })
      .catch(error => {console.log(error)})
  }
  getAccountByBankNumber(number){
    if (this.state.bank_name === "37Bank") {
      axios({
        method:`get`,
        url:`${Config.BEUrl}/v1/accounts/${number}`,
        headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
      })
        .then(resp => {
          this.setState({bank_account_name: resp.data.data.name})
        })
        .catch(error => {console.log(error)})
    }

  }
  handleClickSend() {
    axios({
      method:`post`,
      url:`${Config.BEUrl}/v1/accounts/remind_debts`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
      data: {
        "debtor": this.state.bank_number,
        "amount": this.state.amount,
        "message": this.state.message,
      },
    })
      .then(resp => {
        this.setState({showOTP: true, transaction_id: resp.data.data.transaction_id})
      })
      .catch(error => {console.log(error)})
  }
  handleDebtorChange() {
    const newCurrentDebtor = store.getState().receiver.currentDebtor
    if (!newCurrentDebtor) {
      return
    }
    if (newCurrentDebtor.bank_number === this.state.bank_number && newCurrentDebtor.name === this.state.name) {
      return
    }
    this.setState({
      name: newCurrentDebtor.name, 
      bank_number: newCurrentDebtor.bank_number, 
      bank_name: newCurrentDebtor.bank_name, 
      bank_account_name: newCurrentDebtor.bank_account_name, 
    })
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleDebtorChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleDebtorChange()
  }
  componentWillUnmount() {
    this.state.unsubcribe()
  }
  render() {
    return (
      <div className="General">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Ngân hàng</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.bank_name || ""}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Số tài khoản</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.bank_number || ""}
                onChange={e => {this.setState({bank_number: e.target.value}); this.getAccountByBankNumber(e.target.value)}}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Tên</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.bank_account_name || ""}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Số tiền</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.amount || ""}
                onChange={e => {this.setState({amount: e.target.value})}}
                type="number"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Lời nhắn</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.message || ""}
                onChange={e => {this.setState({message: e.target.value})}}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col>
              <Button variant="primary" onClick={this.handleClickSend}>Gửi</Button>{' '}
            </Col>
          </Form.Group>
        </Form>
      </div>
    )
  }
}

export default DetailDebtor;
