import React from 'react';
import './stype/Receiver.css';
import { Card, Button, Form, ListGroup, Row, Accordion, Col, Container } from "react-bootstrap";
import store from '../store/init.js'
import {setReceivers, pickReceiver} from '../action/Receiver.js'
import axios from 'axios';
import Config from '../config/config';

class Receivers extends React.Component {
  callAPI() {
    axios({
      method:`get`,
      url:`${Config.BEUrl}/v1/accounts/receivers`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
        .then(resp => {
          store.dispatch(setReceivers(resp.data.data))
        })
        .catch(error => {console.log(error)})
  }
  componentDidMount() {
    if (store.getState().receiver.receivers) {
      return
    }
    this.callAPI()
  }
  render() {
    return (
      <div className="Receiver">
        <Container fluid>
          <Row>
            <Col xs={6} md={4}>
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Danh sách nội bộ
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                     <InternalReceiver/>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Danh sách liện ngân hàng
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body> 
                     <ExtranalReceiver/>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Col>
            <Col xs={12} md={8}><DetailReceiver/></Col>
          </Row>
        </Container>
      </div>
    );
  }
}

class InternalReceiver extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myReceivers: [],
    };
    this.handleReceiversChange = this.handleReceiversChange.bind(this);
    this.render = this.render.bind(this);
  }
  handleReceiversChange() {
    if (!store.getState().receiver.receivers) {
      return
    }
    this.setState({myReceivers: store.getState().receiver.receivers.filter(item => item.bank_name==="37Bank")})
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleReceiversChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleReceiversChange()
  }
  componentWillUnmount() {
    if (this.state.unsubcribe) {
      this.state.unsubcribe()
    }
  }
  render() {
    const {myReceivers} = this.state;
    const listReceivers = () => {
      if (myReceivers) {
        return myReceivers.map(item => {
          return (
            <ListGroup.Item action onClick={() =>store.dispatch(pickReceiver(item))}>
            <div>
              <div>{item.name}</div>
              <div>{item.bank_number}</div>
            </div>
          </ListGroup.Item>
          )
        })
      }
      return
    };
    return (
      <div>
        <ListGroup>{listReceivers()}</ListGroup>
      </div>
    )
  }
}
class ExtranalReceiver extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myReceivers: [],
    };
    this.handleReceiversChange = this.handleReceiversChange.bind(this);
    this.render = this.render.bind(this);
  }
  handleReceiversChange() {
    if (!store.getState().receiver.receivers) {
      return
    }
    this.setState({myReceivers: store.getState().receiver.receivers.filter(item => item.bank_name!=="37Bank")})
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleReceiversChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleReceiversChange()
  }
  componentWillUnmount() {
    if (this.state.unsubcribe) {
    this.state.unsubcribe()
    }
  }
  render() {
    const {myReceivers} = this.state;
    const listReceivers = () => {
      if (myReceivers) {
        return myReceivers.map(item => {
          return (
          <ListGroup.Item action onClick={() =>store.dispatch(pickReceiver(item))}>
            <div>
              <div>{item.name}</div>
              <div>{item.bank_number}</div>
            </div>
          </ListGroup.Item>
          )
        })
      }
      return
    };
    return (
      <div>
        <ListGroup>{listReceivers()}</ListGroup>
      </div>
    )
  }

}
class DetailReceiver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",
      bank_number:"",
      bank_name:"",
      bank_account_name:"",
    };
    this.handleReceiversChange = this.handleReceiversChange.bind(this);
    this.render = this.render.bind(this);
    this.getAccountByBankNumber = this.getAccountByBankNumber.bind(this);
    this.handleClickUpdate = this.handleClickUpdate.bind(this);
    this.handleClickCreate = this.handleClickCreate.bind(this);
  }
  handleReceiversChange() {
    const newCurrentReceiver = store.getState().receiver.currentReceiver
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
  handleClickCreate(){
    axios({
      method:`post`,
      data:{
        name: this.state.name,
        bank_name: this.state.bank_name,
        bank_number: this.state.bank_number,
        bank_account_name: this.state.bank_account_name,
      },
      url:`${Config.BEUrl}/v1/accounts/receivers`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
      .then(resp => {
        const listReceivers = store.getState().receiver.receivers
        listReceivers.push(resp.data.data)
        store.dispatch(setReceivers(listReceivers))
      })
      .catch(error => {console.log(error)})
  }
  handleClickUpdate(){
    const currentReceiver = store.getState().receiver.currentReceiver
    currentReceiver.name = this.state.name
    axios({
      method:`put`,
      data:{name: this.state.name},
      url:`${Config.BEUrl}/v1/accounts/receivers/${currentReceiver.id}`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
      .then(_ => {})
      .catch(error => {console.log(error)})
    store.dispatch(pickReceiver(currentReceiver))
  }
  handleClickDelete(){
    const currentReceiver = store.getState().receiver.currentReceiver
    if (!currentReceiver || !currentReceiver.id) {
      return
    }
    const listReceivers = store.getState().receiver.receivers.filter(item => item.id !== currentReceiver.id)
    store.dispatch(pickReceiver({}))
    store.dispatch(setReceivers(listReceivers))
    axios({
      method:`delete`,
      url:`${Config.BEUrl}/v1/accounts/receivers/${currentReceiver.id}`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
      .then(_ => {})
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
  render() {
    return (
      <div className="General">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Tên gợi nhớ</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.name || ""}
                onChange={e => {this.setState({name: e.target.value})}}
              />
            </Col>
          </Form.Group>
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
            <Col>
              <Button variant="primary" onClick={this.handleClickCreate}>Tạo mới</Button>{' '}
            </Col>
            <Col>
              <Button variant="primary" onClick={this.handleClickUpdate}>Cập nhật</Button>{' '}
            </Col>
            <Col>
              <Button variant="primary" onClick={this.handleClickDelete}>Xóa</Button>{' '}
            </Col>
          </Form.Group>
        </Form>
      </div>
    )
  }
}
export default Receivers;
