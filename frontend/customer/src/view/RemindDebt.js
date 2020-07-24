import React from 'react';
import { Card, ListGroup, Row, Accordion, Col, Container } from "react-bootstrap";
import DetailDebtor from './DetailDebtor.js';
import InternalReceiver from './InternalReceiver.js';
import {pickDebtor} from '../action/Debtor.js'
import {setMyDebts, setMyDebtors} from '../action/Debtor.js'
import Config from '../config/config';
import store from '../store/init.js'
import {setReceivers} from '../action/Receiver.js'
import axios from 'axios';

class Debts extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      Debts: [],
      typeSelect: "2",
    };
    this.handleDebtsChange = this.handleDebtsChange.bind(this);
    this.render = this.render.bind(this);
  }
  handleDebtsChange() {
    if (!store.getState().receiver.myDebtors && !store.getState().receiver.myDebts)  {
      return
    }
    if (this.props.typeSelect == "2") { 
      this.setState({Debts: store.getState().receiver.myDebtors, typeSelect: "2"})
    }
    if (this.props.typeSelect == "3") { 
      this.setState({Debts: store.getState().receiver.myDebts, typeSelect: "3"})
    }
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleDebtsChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleDebtsChange()
  }
  componentWillUnmount() {
    if (this.state.unsubcribe) {
      this.state.unsubcribe()
    }
  }
  render() {
    if (this.state.typeSelect !== this.props.typeSelect) {
      if (this.props.typeSelect == "2") { 
        this.setState({Debts: store.getState().receiver.myDebtors, typeSelect: "2"})
      }
      if (this.props.typeSelect == "3") { 
        this.setState({Debts: store.getState().receiver.myDebts, typeSelect: "3"})
      }
    }
    const {Debts} = this.state;
    const listDebts = () => {
      if (Debts) {
        return Debts.map(item => {
          return (
            <ListGroup.Item action >
              <Row>
                <div>{item.amount}</div>
                <div>{item.amount}</div>
              </Row>
            </ListGroup.Item>
          )
        })
      }
      return
    };
    return (
      <div>
        <ListGroup>{listDebts()}</ListGroup>
      </div>
    )
  }
}

class SwitchUI extends React.Component {
  constructor(props) {
     super(props);
  }
  render() {
    if (this.props.typeSelect && this.props.typeSelect == "1") {
      return <DetailDebtor/>
    }
    return <Debts typeSelect={this.props.typeSelect}/>
  }
}

class RemindDebt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       typeSelect:"1",
     }
  }
  setMyDebtors() {
    axios({
      method:`get`,
      url:`${Config.BEUrl}/v1/accounts/remind_debts/mydebtors`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
        .then(resp => {
          store.dispatch(setMyDebtors(resp.data.data))
        })
        .catch(error => {console.log(error)})
  }
  setMyDebts() {
    axios({
      method:`get`,
      url:`${Config.BEUrl}/v1/accounts/remind_debts/me`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
        .then(resp => {
          store.dispatch(setMyDebts(resp.data.data))
        })
        .catch(error => {console.log(error)})
  }
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
    this.setMyDebts()
    this.setMyDebtors()
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
                  <Accordion.Toggle as={Card.Header} eventKey="0" onClick={() => {this.setState({typeSelect:"1"})}}>
                    Danh sách nội bộ
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                     <InternalReceiver onClickItem={pickDebtor}/>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1" onClick={() => {this.setState({typeSelect:"2"})}}>
                    Khác
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <ListGroup>
                        <ListGroup.Item action onClick={() => {this.setState({typeSelect:"2"})}}>
                          Danh sách nợ
                        </ListGroup.Item>
                        <ListGroup.Item action onClick={() => {this.setState({typeSelect:"3"})}}>
                          Danh sách tôi nợ
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Col>
            <Col xs={12} md={8}>
              <SwitchUI typeSelect={this.state.typeSelect}/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default RemindDebt;
