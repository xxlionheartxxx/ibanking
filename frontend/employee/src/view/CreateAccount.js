import React, { useState }from 'react';
import './stype/CreateAccount.css';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      name: "",
      phonenumber: "",
      email: "",
    };
  }

  render() {
    return (
      <div className="CreateAccount">
        <form onSubmit={handleSubmit()}>
          <FormGroup controlId="username">
            <p>Tên đăng nhập</p>
            <FormControl
              autoFocus
              value={this.state.username}
              onChange={e => {this.setState({username: e.target.value})}}
            />
          </FormGroup>
          <FormGroup controlId="password">
            <p>Mật khẩu</p>
            <FormControl
              value={this.state.password}
              onChange={e => {this.setState({password: e.target.value})}}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="name">
            <p>Tên</p>
            <FormControl
              value={this.state.name}
              onChange={e => {this.setState({name: e.target.value})}}
            />
          </FormGroup>
          <FormGroup controlId="email">
            <p>Email</p>
            <FormControl
              value={this.state.email}
              onChange={e => {this.setState({email: e.target.value})}}
              type="email"
            />
          </FormGroup>
          <FormGroup controlId="phone">
            <p>Số điện thoại</p>
            <FormControl
              value={this.state.phonenumber}
              onChange={e => {this.setState({phone: e.target.value})}}
              type="password"
            />
          </FormGroup>
          <Button block disabled={!validateForm()} type="submit">
            Tạo
          </Button>
        </form>
      </div>
    );
  }
}

function handleSubmit() {}
function validateForm() {}
export default CreateAccount;
