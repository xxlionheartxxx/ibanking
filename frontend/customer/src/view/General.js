import React from 'react';
import { Col, Modal, Form, Button, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
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
      oldPass: "",
      newPass: "",
      verifyPass: "",
      showChangePassword: false,
      otp: "",
      hiddenWarningInvalidVerify: true,
      hiddenWarningInvalidOldPass: true,
    };
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout(){
    localStorage.removeItem('37ibanking.accessToken.customer')
    this.props.history.push('/')
    return
  }
  handleChangePass() {
    if (this.state.verifyPass !== this.state.newPass) {
       this.setState({hiddenWarningInvalidVerify: false})
       return 
    }
    axios({
      method:`put`,
      url:`${Config.BEUrl}/v1/accounts/password`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
      data: {
        "oldPass": this.state.oldPass,
        "newPass": this.state.newPass,
      },
    })
        .then(resp => {
          this.setState({showChangePassword: false})
        })
        .catch(error => {console.log(error.response); this.setState({hiddenWarningInvalidOldPass: false})})
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
          <Form.Group as={Row}>
            <Col>
              <Button variant="primary" onClick={()=>this.setState({showChangePassword:true})}>Đổi mật khẩu</Button>
            </Col>
            <Col>
              <Button variant="primary" onClick={this.handleLogout}>Đăng xuất</Button>
            </Col>
          </Form.Group>
          <Modal show={this.state.showChangePassword} onHide={()=>{this.setState({showChangePassword: false})}}>
            <Modal.Header closeButton>
              <Modal.Title>Đổi mật khẩu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row}>
                  <Form.Label column>Mật khẩu cũ</Form.Label>
                  <Col>
                    <Form.Control
                      className="mb-2 mr-sm-2"
                      type="password"
                      value={this.state.oldPass || ""}
                      onChange={e => {this.setState({oldPass: e.target.value, hiddenWarningInvalidVerify: true, hiddenWarningInvalidOldPass: true})}}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column>Mật khẩu mới</Form.Label>
                  <Col>
                    <Form.Control
                      className="mb-2 mr-sm-2"
                      type="password"
                      value={this.state.newPass || ""}
                      onChange={e => {this.setState({newPass: e.target.value, hiddenWarningInvalidVerify: true, hiddenWarningInvalidOldPass: true})}}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column>Xác nhận mật khẩu mới</Form.Label>
                  <Col>
                    <Form.Control
                      className="mb-2 mr-sm-2"
                      type="password"
                      value={this.state.verifyPass || ""}
                      onChange={e => {this.setState({verifyPass: e.target.value, hiddenWarningInvalidVerify: true, hiddenWarningInvalidOldPass: true})}}
                    />
                  </Col>
                </Form.Group>
              </Form>
              <div className="WarningLogin">
                <div hidden={this.state.hiddenWarningInvalidVerify}>Xác nhận mật khẩu không đúng</div>
                <div hidden={this.state.hiddenWarningInvalidOldPass}>Mật khẩu không đúng</div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleChangePass}>
                Gửi
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      </div>
    );
  }
}
export default withRouter(General);
