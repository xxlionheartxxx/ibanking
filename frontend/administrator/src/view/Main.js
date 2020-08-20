import React from 'react';
import './stype/Main.css';
import {
  Switch, Link, Route, Redirect,
} from "react-router-dom";
import { Nav } from "react-bootstrap";
import PrivateRoute from '../router/PrivateRoute'
import History from './History.js';
import Employee from './Employee.js';


class Main extends React.Component {
  render() {
    return (
      <div className="Main_Wrap Term_Condition">
        <Nav fill variant="tabs" activeKey="/history">
          <Nav.Item>
             <Nav.Link as={Link} to="/history">Lịch sử giao dịch</Nav.Link>
          </Nav.Item>
          <Nav.Item>
             <Nav.Link as={Link} to="/employee">Nhân viên</Nav.Link>
          </Nav.Item>
        </Nav>
        <Switch>
          <PrivateRoute path="/employee">
            <Employee />
          </PrivateRoute>
          <PrivateRoute path="/history">
            <History />
          </PrivateRoute>
          <Route path="*">
            <Redirect
              to={{
                pathname: "/history"
              }}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default Main;
