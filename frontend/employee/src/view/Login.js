import React, { useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from 'axios';
import "./Login.css";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return userName.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.get('http://ibanking.imjet.vn/')
      .then(response => console.log(response))
  }

  return (
    <div className="Login">
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="userName">
          <FormLabel>Tên đăng nhập</FormLabel>
          <FormControl
            autoFocus
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Mật khẩu</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block disabled={!validateForm()} type="submit">
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
