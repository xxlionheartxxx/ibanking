import React from 'react';
import { Button, Col, Form } from "react-bootstrap";
import './stype/General.css'
import axios from 'axios';
import Config from '../config/config';


class General extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDebtRemind: false,
    };
  }
  callAPI() {
    axios({
      method:`get`,
      url:`${Config.BEUrl}/v1/accounts`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
        .then(resp => {
          console.log(resp.data.data)
        })
  }
  componentDidMount() {
    this.callAPI()
  }
  render() {
    return (
      <div className="General">
        <Form>
          <Form.Row>
            <Col>
              <Form.Label>
                Tên
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Label>
                Tên đăng nhập
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Label>
                Số tài khoản
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Label>
                Số tài khoản
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Label>
                Email
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
              />
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Label>
                Số dư
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
              />
            </Col>
          </Form.Row>
          <Button type="submit" className="mb-2">
            Sửa
          </Button>
        </Form>
      </div>
    );
  }
}
export default General;
