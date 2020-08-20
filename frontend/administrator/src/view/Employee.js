import React from 'react';
import './stype/Employee.css';
import Config from '../config/config';
import { Form, Button, Card, ListGroup, Row, Accordion, Col, Container } from "react-bootstrap";
import store from '../store/init.js'
import {setEmployees, pickEmployee} from '../action/Employee.js'
import axios from 'axios';

class Employees extends React.Component {
  callAPI() {
    axios({
      method:`get`,
      url:`${Config.BEUrl}/v1/admin/employees`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.admin')}`},
    })
        .then(resp => {
          store.dispatch(setEmployees(resp.data.data))
        })
        .catch(error => {console.log(error)})
  }
  componentDidMount() {
    if (store.getState().employee.employees) {
      return
    }
    this.callAPI()
  }

  render() {
    return (
      <div className="Employee">
        <Container fluid>
          <Row>
            <Col xs={6} md={4}>
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Danh sách
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                     <Employee onClickItem={pickEmployee}/>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Col>
            <Col xs={12} md={8}><DetailEmployee/></Col>
          </Row>
        </Container>
      </div>
    )
  }
}

class Employee extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myEmployees: [],
    };
    this.handleEmployeesChange = this.handleEmployeesChange.bind(this);
    this.render = this.render.bind(this);
  }
  handleEmployeesChange() {
    if (!store.getState().employee.employees) {
      return
    }
    this.setState({myEmployees: store.getState().employee.employees})
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleEmployeesChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleEmployeesChange()
  }
  componentWillUnmount() {
    if (this.state.unsubcribe) {
      this.state.unsubcribe()
    }
  }
  render() {
    const {myEmployees} = this.state;
    const listEmployees = () => {
      if (myEmployees) {
        return myEmployees.map(item => {
          return (
            <ListGroup.Item action onClick={() =>store.dispatch(this.props.onClickItem(item))}>
            <div>
              <div>{item.id} {item.name}</div>
            </div>
          </ListGroup.Item>
          )
        })
      }
      return
    };
    return (
      <div>
        <ListGroup>{listEmployees()}</ListGroup>
      </div>
    )
  }
}

class DetailEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name:"",
      username:"",
      password:"",
    };
    this.handleEmployeesChange = this.handleEmployeesChange.bind(this);
    this.render = this.render.bind(this);
    this.handleClickUpdate = this.handleClickUpdate.bind(this);
    this.handleClickCreate = this.handleClickCreate.bind(this);
  }
  handleEmployeesChange() {
    const newCurrentEmployee = store.getState().employee.employee
    if (!newCurrentEmployee) {
      return
    }
    if (newCurrentEmployee.id === this.state.id && newCurrentEmployee.name === this.state.name) {
      return
    }
    this.setState({
      name: newCurrentEmployee.name, 
      username: newCurrentEmployee.username, 
      password:"", 
      id: newCurrentEmployee.id, 
    })
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleEmployeesChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleEmployeesChange()
  }
  componentWillUnmount() {
    this.state.unsubcribe()
  }
  handleClickCreate(){
    axios({
      method:`post`,
      data:{
        name: this.state.name,
        username: this.state.username,
        password: this.state.password,
      },
      url:`${Config.BEUrl}/v1/admin/employees`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.admin')}`},
    })
      .then(resp => {
        const listEmployees = store.getState().employee.employees
        listEmployees.push(resp.data.data)
        store.dispatch(setEmployees(listEmployees))
      })
      .catch(error => {console.log(error)})
  }
  handleClickUpdate(){
    const employee = store.getState().employee.employee
    axios({
      method:`put`,
      data:{name: this.state.name, username: this.state.username,password: this.state.password},
      url:`${Config.BEUrl}/v1/admin/employees/${employee.id}`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.admin')}`},
    })
      .then(_ => {})
      .catch(error => {console.log(error)})
    store.dispatch(pickEmployee(employee))
  }
  handleClickDelete(){
    const employee = store.getState().employee.employee
    if (!employee || !employee.id) {
      return
    }
    const listEmployees = store.getState().employee.employees.filter(item => item.id !== employee.id)
    store.dispatch(pickEmployee({}))
    store.dispatch(setEmployees(listEmployees))
    axios({
      method:`delete`,
      url:`${Config.BEUrl}/v1/admin/employees/${employee.id}`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.admin')}`},
    })
      .then(_ => {})
      .catch(error => {console.log(error)})
  }
  render() {
    return (
      <div className="General">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Tên</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.name || ""}
                onChange={e => {this.setState({name: e.target.value})}}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Tên đăng nhập</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.username || ""}
                onChange={e => {this.setState({username: e.target.value})}}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Mật khẩu</Form.Label>
            <Col sm={10}>
              <Form.Control
                className="mb-2 mr-sm-2"
                value={this.state.password || ""}
                onChange={e => {this.setState({password: e.target.value})}}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col>
              <Button variant="primary" onClick={this.handleClickCreate}>Tạo mới</Button>{' '}
            </Col>
            <Col>
              <Button variant="primary" onClick={this.handleClickUpdate}>Cập nhật</Button>{' '}
            </Col>
            <Col>
              <Button variant="primary" onClick={this.handleClickDelete}>Xóa</Button>{' '}
            </Col>
          </Form.Group>
        </Form>
      </div>
    )
  }
}


export default Employees;
