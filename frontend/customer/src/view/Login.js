import React, { useState } from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import { Button, Modal, Form, Row, Col,  FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from 'axios';
import Config from '../config/config';
import "./stype/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [fpUsername, setfpUsername] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [hiddenWarningLogin, setHiddenWarningLogin] = useState(true);
  const [hiddenOTP, setHiddenOTP] = useState(true);
  const [hiddenUsername, setHiddenUsername] = useState(false);
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }
  function handleForgotPassOTP() {
    axios.put(`${Config.BEUrl}/v1/accounts/forgot-password/otp`, {
        username: fpUsername,
        otp,
      })
      .then(resp => {
        setShowForgotPass(false)
        setHiddenOTP(true)
        setfpUsername("")
        setOTP("")
      })
      .catch(err => {
        setHiddenWarningLogin(false)
      })

    return
  }
  function handleForgotPass() {
    if (hiddenUsername) {
      return handleForgotPassOTP()
    }
    axios.put(`${Config.BEUrl}/v1/accounts/forgot-password`, {
        username: fpUsername,
      })
      .then(resp => {
        setHiddenOTP(false)
        setHiddenUsername(true)
      })
      .catch(err => {
        console.log(err)
      })

    return
  }
  function handleSubmit(event) {
    event.preventDefault();
    axios.put(`${Config.BEUrl}/v1/accounts/login`, {
        username,
        password,
      })
      .then(resp => {
        setHiddenWarningLogin(true)
        localStorage.setItem('37ibanking.accessToken.customer', resp.data.data.accessToken)
        localStorage.setItem('37ibanking.refreshToken.customer', resp.data.data.refreshToken)
        history.replace(from);
      })
      .catch(err => {
        setHiddenWarningLogin(false)
      })
  }

  return (
    <div className="Login">
      <h1>Đăng nhập khách hàng</h1>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="username">
          <FormLabel>Tên đăng nhập</FormLabel>
          <FormControl
            autoFocus
            value={username}
            onChange={e => {setUsername(e.target.value); setHiddenWarningLogin(true)}}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Mật khẩu</FormLabel>
          <FormControl
            value={password}
            onChange={e => {setPassword(e.target.value); setHiddenWarningLogin(true)}}
            type="password"
          />
        </FormGroup>
        <div className="WarningLogin">
          <div hidden={hiddenWarningLogin}>Tên đăng nhập hoặc mật khẩu không đúng</div>
        </div>
        <Button block disabled={!validateForm()} type="submit">
          Đăng nhập
        </Button>
        <Button block onClick={() => setShowForgotPass(true)}>Quên mật khẩu</Button>
      </form>
      <Modal show={showForgotPass} onHide={()=>setShowForgotPass(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Quên mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} hidden={hiddenUsername}>
            <Form.Label column>Tên đăng nhập</Form.Label>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={fpUsername}
                onChange={e => {setfpUsername(e.target.value)}}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} hidden={hiddenOTP}>
            <Form.Label column>OTP</Form.Label>
            <Col>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={otp}
                onChange={e => {setOTP(e.target.value)}}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleForgotPass}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
