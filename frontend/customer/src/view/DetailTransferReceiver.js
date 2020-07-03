import React from 'react';
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import store from '../store/init.js'
import axios from 'axios';
import Config from '../config/config';

class DetailTranferReceiver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bank_number:"",
      bank_name:"",
      bank_account_name:"",
      money:"",
      message:"",
      showOTP:false,
      transaction_id: 0,
      feeForMe:true,
    };
    this.render = this.render.bind(this);
    this.handleReceiversChange = this.handleReceiversChange.bind(this);
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
      data: this.state,
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
      url:`${Config.BEUrl}/v1/accounts/${this.state.bank_number}/transfer`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
      data: {
        "bank_number": this.state.bank_number,
        "bank_name": this.state.bank_name,
        "money": this.state.money,
        "message": this.state.message,
        "fee_for_me": this.state.feeForMe,
      },
    })
      .then(resp => {
        this.setState({showOTP: true, transaction_id: resp.data.data.transaction_id})
      })
      .catch(error => {console.log(error)})
  }
  handleReceiversChange() {
    const newCurrentReceiver = store.getState().receiver.currentTransferReceiver
    if (!newCurrentReceiver) {
      return
    }
    if (newCurrentReceiver.bank_number === this.state.bank_number && newCurrentReceiver.name === this.state.name) {
      return
    }
    this.setState({
      name: newCurrentReceiver.name, 
      bank_number: newCurrentReceiver.bank_number, 
      bank_name: newCurrentReceiver.bank_name, 
      bank_account_name: newCurrentReceiver.bank_account_name, 
    })
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleReceiversChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleReceiversChange()
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
                onChange={e => {this.setState({bank_name: e.target.value})}}
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
                value={this.state.money || ""}
                onChange={e => {this.setState({money: e.target.value})}}
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
            <Form.Control as="select" custom onChange={e=>{this.setState({feeForMe: e.target.value==='Người gửi trả phí'? true:false})}}>
              <option>Người gửi trả phí</option>
              <option>Người nhận trả phí</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Row}>
            <Col>
              <Button variant="primary" onClick={this.handleClickSend}>Gửi</Button>{' '}
            </Col>
          </Form.Group>
        </Form>
        <Modal show={this.state.showOTP} onHide={this.handleCloseOTP}>
          <Modal.Header closeButton>
            <Modal.Title>Xác thực OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>OTP</Form.Label>
                <Col sm={10}>
                  <Form.Control
                    className="mb-2 mr-sm-2"
                    value={this.state.otp || ""}
                    onChange={e => {this.setState({otp: e.target.value})}}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClickSendOTP}>
              Gửi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default DetailTranferReceiver;
