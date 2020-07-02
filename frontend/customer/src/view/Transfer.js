import React from 'react';
import { Card, Row, Accordion, Col, Container } from "react-bootstrap";
import InternalReceiver from './InternalReceiver.js';
import ExtranalReceiver from './ExtranalReceiver.js';
import DetailTransferReceiver from './DetailTransferReceiver.js';
import {pickTransferReceiver} from '../action/TransferReceiver.js'
import Config from '../config/config';
import store from '../store/init.js'
import {setReceivers} from '../action/Receiver.js'
import axios from 'axios';

class Transfer extends React.Component {
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
                     <InternalReceiver onClickItem={pickTransferReceiver}/>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Danh sách liện ngân hàng
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body> 
                     <ExtranalReceiver onClickItem={pickTransferReceiver}/>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Col>
            <Col xs={12} md={8}><DetailTransferReceiver/></Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Transfer;
