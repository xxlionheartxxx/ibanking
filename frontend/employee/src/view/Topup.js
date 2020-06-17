import React from 'react';
import './stype/Topup.css';
import { Button, FormGroup, FormControl } from "react-bootstrap";
import axios from 'axios';
import Config from '../config/config';

class Topup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account_number: "",
      username: "",
      money: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event){
      event.preventDefault();
      console.log(this)
      axios.put(`${Config.BEUrl}/v1/accounts/topup`, {
          accountNumber: this.state.account_number,
          username: this.state.username,
          amount: this.state.money,
        })
        .then(resp => {
        })
        .catch(_ => {
        })
  }
  render() {
    return (
      <div className="Topup">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="account_number">
            <p>Số tài khoản</p>
            <FormControl
              autoFocus
              value={this.state.account_number}
              onChange={e => {this.setState({account_number: e.target.value})}}
            />
          </FormGroup>
          <FormGroup controlId="username">
            <p>Tên đăng nhập</p>
            <FormControl
              value={this.state.username}
              onChange={e => {this.setState({username: e.target.value})}}
            />
          </FormGroup>
          <FormGroup controlId="money">
            <p>Số tiền</p>
            <FormControl
              value={this.state.money}
              onChange={e => {this.setState({money: e.target.value})}}
            />
          </FormGroup>
          <Button block type="submit">
            Nạp tiền
          </Button>
        </form>
      </div>
    );
  }
}

export default Topup;
