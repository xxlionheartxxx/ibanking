import React from 'react';
import './stype/Receiver.css';
import { Card, Row, Accordion, Col, Container } from "react-bootstrap";
import store from '../store/init.js'

class Receivers extends React.Component {
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
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    Danh sách liện ngân hàng
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body></Card.Body>
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

class DetailReceiver extends React.Component {
  render() {
    console.log(store.getState().pickReceiver.currentReceiver)
    return (
      <div>Detail Receiver{store.getState().pickReceiver.currentReceiver.name}</div>
    )
  }
}
export default Receivers;
