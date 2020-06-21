import React from 'react';
import General from './General.js'
import Receivers from './Receivers.js'
import Transfer from './Transfer.js'
import RemindDebt from './RemindDebt.js'
import { Nav } from "react-bootstrap";
import PrivateRoute from '../router/PrivateRoute'
import './stype/Main.css'
import {
  Switch, Link, Route, Redirect,
} from "react-router-dom";


class Main extends React.Component {
  render() {
    return (
      <div className="Main_Wrap Term_Condition">
        <Nav fill variant="tabs" activeKey="/general">
          <Nav.Item>
             <Nav.Link as={Link} to="/general">Thông tin chung</Nav.Link>
          </Nav.Item>
          <Nav.Item>
             <Nav.Link as={Link} to="/receivers">Người nhận</Nav.Link>
          </Nav.Item>
          <Nav.Item>
             <Nav.Link as={Link} to="/transfer">Chuyển khoản</Nav.Link>
          </Nav.Item>
          <Nav.Item>
             <Nav.Link as={Link} to="/remind-debt">Nhắc nợ</Nav.Link>
          </Nav.Item>
        </Nav>
        <Switch>
          <PrivateRoute path="/general">
            <General />
          </PrivateRoute>
          <PrivateRoute path="/receivers">
            <Receivers />
          </PrivateRoute>
          <PrivateRoute path="/transfer">
            <Transfer />
          </PrivateRoute>
          <PrivateRoute path="/remind-debt">
            <RemindDebt />
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
