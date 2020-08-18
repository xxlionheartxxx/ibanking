import React, { useState } from 'react';
import {useHistory, useLocation} from 'react-router-dom'
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from 'axios';
import Config from '../config/config.js';
import "./stype/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenWarningLogin, setHiddenWarningLogin] = useState(true);
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.put(`${Config.BEUrl}/v1/admin/login`, {
        username,
        password,
      })
      .then(resp => {
        setHiddenWarningLogin(true)
        localStorage.setItem('37ibanking.accessToken.admin', resp.data.data.accessToken)
        localStorage.setItem('37ibanking.refreshToken.admin', resp.data.data.refreshToken)
        history.replace(from);
      })
      .catch(err => {
        setHiddenWarningLogin(false)
      })
  }

  return (
    <div className="Login">
      <h1>Đăng nhập admin</h1>
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
      </form>
    </div>
  );
}
