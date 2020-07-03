import React from 'react';
import { Table, Form } from "react-bootstrap";
import axios from 'axios';
import './stype/History.css';
import Config from '../config/config';

class TableHistory extends React.Component {
  cell(content,header) {
    const cellMarkup = header ? (
      <th className="Cell Cell-header">
        {content}
      </th>
    ) : (
      <td className="Cell">
        {content}
      </td>
    );
    return (cellMarkup);
  }

  renderHeadingRow(_cell, cellIndex) {
    const {headings} = this.props;
    return this.cell(headings[cellIndex],true)
  };
  renderRow(_row, rowIndex) {
    const {rows, headings} = this.props;

    return (
      <tr key={`row-${rowIndex}`}>
        {headings.map((_cell, cellIndex) => {
          return (
            <td>{rows[rowIndex][headings[cellIndex]]}</td>
          )
        })}
      </tr>
    )
  };
  render() {
    const {headings, rows} = this.props;

    this.renderHeadingRow = this.renderHeadingRow.bind(this);
    this.renderRow = this.renderRow.bind(this);
    const theadMarkup = (
      <tr key="heading">{headings.map(this.renderHeadingRow)}</tr>
    );

    const tbodyMarkup = () => {
      return rows.map(this.renderRow)
    };
    return (
      <div>
        <Table striped bordered hover>
          <thead>{theadMarkup}</thead>
          <tbody>{tbodyMarkup()}</tbody>
        </Table>
      </div>
    );
  }
}

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountNumber: "",
      isTopup: false,
      isBankTransfer: false,
      isDebtRemind: false,
      rows: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  callAPI() {
    let types = []
    if (this.state.isTopup) {
      types = types.concat('topup')
    }
    if (this.state.isBankTransfer) {
      types = types.concat('bank_transfer')
    }
    if (this.state.isDebtRemind) {
      types = types.concat('debt_remind')
    }
    axios({
      method:"get",
      url:`${Config.BEUrl}/v1/accounts/history-transactions?accountNumber=${this.state.accountNumber}&types=${types}`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.employee')}`},
    })
        .then(resp => {
          this.setState({rows: resp.data.data})
        })
  }
  handleSubmit(event) {
    event.preventDefault();
    this.callAPI()
 
  }
  componentDidMount() {
    this.callAPI()
  }
  render() {
   const headings = [
        'id',
        'type',
        'account_number',
        'amount',
        'created_at',
        'updated_at',
      ];
 
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
           <Form.Group>
             <div className="History">
               <Form.Control 
                 placeholder="Nhập tài khoản 370000" 
                 onChange={e => this.setState({accountNumber: e.target.value})}
               />
             </div>
          </Form.Group>
           <Form.Group controlId="formGroupEmail">
            <div key={`inline-checkbox`} className="mb-3">
              <p style={{display:'inline-flex', 'margin-right':'.75rem'}}>Loại: </p>
              <Form.Check inline label="topup" type="checkbox" id={`inline-checkbox-1`}
                onChange={e => this.setState({isTopup: e.target.checked})}
              />
              <Form.Check inline label="bank_transfer" type="checkbox" id={`inline-checkbox-2`} 
                onChange={e => this.setState({isBankTransfer: e.target.checked})}
              />
              <Form.Check inline label="debt_remind" type="checkbox" id={`inline-checkbox-3`} 
                onChange={e => this.setState({isDebtRemind: e.target.checked})}
              />
            </div>
          </Form.Group>
        </Form>
        <TableHistory headings={headings} rows={this.state.rows}/>
      </div>
    );
  }
}

export default History;
