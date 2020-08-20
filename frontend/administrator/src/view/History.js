import React from 'react';
import { Table, Form } from "react-bootstrap";
import axios from 'axios';
import './stype/History.css';
import Config from '../config/config';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';


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
      bankName: "",
      from: 0,
      to: 0,
      rows: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  callAPI() {
    let from=this.state.from
    let to=this.state.to
    axios({
      method:"get",
      url:`${Config.BEUrl}/v1/admin/history-transactions?bankName=${this.state.bankName}&from=${from}&to=${to}`,
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
        'bank_name',
        'created_at',
        'updated_at',
      ];
 
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
           <Form.Group>
             <DateRangePicker
               initialSettings={{ startDate: '1/6/2020', endDate: '1/7/2020' }}
               onApply={(e,picker)=> {
                this.setState({from:picker.startDate.format("X")})
                this.setState({to:picker.endDate.format("X")})
                this.handleSubmit(e)
               }}
             >
               <a>Date Range</a>
             </DateRangePicker>
          </Form.Group>
           <Form.Group controlId="formGroupEmail">
            <div key={`inline-checkbox`} className="mb-3">
              <Form.Control as="select" custom
                onChange={e => this.setState({bankName:e.target.value})}
              >
                <option>all</option>
                <option>37Bank</option>
                <option>24Bank</option>
                <option>25Bank</option>
              </Form.Control>
            </div>
          </Form.Group>
        </Form>
        <TableHistory headings={headings} rows={this.state.rows}/>
      </div>
    );
  }
}

export default History;
