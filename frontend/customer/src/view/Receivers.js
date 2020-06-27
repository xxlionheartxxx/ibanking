import React from 'react';
import './stype/Receiver.css';
import { Card, Row, Accordion, Col, Container } from "react-bootstrap";
import store from '../store/init.js'
import {setReceivers} from '../action/Receiver.js'
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
  }
  handleReceiversChange() {
    if (!store.getState().receiver.receivers) {
      return
    }
    this.setState({myReceivers: store.getState().receiver.receivers.filter(item => item.bank_name=="37Bank")})
		this.render()
  }
  componentDidMount() {
		store.subscribe(this.handleReceiversChange)
    this.handleReceiversChange()
  }
  render() {
    return (
      <div>
      </div>
    )
  }
}
class ExtranalReceiver extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}
class DetailReceiver extends React.Component {
  render() {
    return (
      <div>Detail Receiver</div>
    )
  }
}
export default Receivers;
