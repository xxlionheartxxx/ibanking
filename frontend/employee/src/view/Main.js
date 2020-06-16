import React from 'react';
import './stype/Main.css';
import {
  Switch, Link, Route, Redirect,
} from "react-router-dom";
import { Nav } from "react-bootstrap";
import PrivateRoute from '../router/PrivateRoute'
import History from './History.js';
import Topup from './Topup.js';
import CreateAccount from './CreateAccount.js';


class Main extends React.Component {
  render() {
    return (
      <div className="Main_Wrap Term_Condition">
        <Nav fill variant="tabs" activeKey="/create_account">
          <Nav.Item>
             <Nav.Link as={Link} to="/create_account">Tạo tài khoản</Nav.Link>
          </Nav.Item>
          <Nav.Item>
             <Nav.Link as={Link} to="/topup">Nạp tiền</Nav.Link>
          </Nav.Item>
          <Nav.Item>
             <Nav.Link as={Link} to="/history">Lịch sử giao dịch</Nav.Link>
          </Nav.Item>
        </Nav>
        <Switch>
          <PrivateRoute path="/create_account">
            <CreateAccount />
          </PrivateRoute>
          <PrivateRoute path="/topup">
            <Topup />
          </PrivateRoute>
          <PrivateRoute path="/history">
            <History />
          </PrivateRoute>
          <Route path="*">
            <Redirect
              to={{
                pathname: "/create_account"
              }}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default Main;
