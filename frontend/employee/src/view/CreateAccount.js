import React from 'react';
import './stype/CreateAccount.css';
import { Button, FormGroup, FormControl } from "react-bootstrap";
import axios from 'axios';
import Config from '../config/config';

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
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event){
      event.preventDefault();
      axios.post(`${Config.BEUrl}/v1/accounts`, {
          username: this.state.username,
          password: this.state.password,
          name: this.state.name,
          phonenumber: this.state.phonenumber,
          email: this.state.email,
        })
        .then(resp => {
        })
        .catch(_ => {
        })
  }
  render() {
    return (
      <div className="CreateAccount">
        <form onSubmit={this.handleSubmit}>
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
          <FormGroup controlId="phonenumber">
            <p>Số điện thoại</p>
            <FormControl
              value={this.state.phonenumber}
              onChange={e => {this.setState({phonenumber: e.target.value})}}
              type="tel"
              placeholder="0932747969"
            />
          </FormGroup>
          <Button block type="submit">
            Tạo
          </Button>
        </form>
      </div>
    );
  }
}

export default CreateAccount;
