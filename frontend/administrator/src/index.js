import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './view/Login'
import HomeIfLoginRoute from './router/HomeIfLogin'
import Home from './view/Home'
import PrivateRoute from './router/PrivateRoute'

class IBanking extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <HomeIfLoginRoute path="/login">
              <Login />
            </HomeIfLoginRoute>
            <PrivateRoute path="/home">
              <Home />
            </PrivateRoute>
            <Route path="*">
              <PrivateRoute path="*">
                <Home />
              </PrivateRoute>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

// ========================================

ReactDOM.render(
  <IBanking />,
  document.getElementById('root')
);
