import React from 'react';
import { Col, Form, Row } from "react-bootstrap";
import './stype/General.css'
import axios from 'axios';
import Config from '../config/config';


class General extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      email: "",
      phonenumber: "",
      number: "",
      money: 0,
    };
  }
  callAPI() {
    axios({
      method:`get`,
      url:`${Config.BEUrl}/v1/accounts`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
        .then(resp => {
          this.setState({
            name: resp.data.data.name,
            username: resp.data.data.username,
            phonenumber: resp.data.data.phonenumber,
            email: resp.data.data.email,
            number: resp.data.data.number,
            money: resp.data.data.money,
          })
        })
        .catch(error => {console.log(error.response)})
  }
  componentDidMount() {
    this.callAPI()
  }
  render() {
    return (
      <div className="General">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Tên</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.name || ""}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Số điện thoại</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.phonenumber || ""}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Email</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.email || ""}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Tên đăng nhập</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.username || ""}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Số tài khoản</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.number || ""}
                readOnly
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Số dư</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.money || ""}
                readOnly
              />
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default General;
