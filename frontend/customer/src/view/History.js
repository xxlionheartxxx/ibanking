import React from 'react';
import { Table, Form } from "react-bootstrap";
import axios from 'axios';
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
      url:`${Config.BEUrl}/v1/accounts/history-transactions?accountNumber=me`,
      headers:{"Authentication": `${localStorage.getItem('37ibanking.accessToken.customer')}`},
    })
        .then(resp => {
          this.setState({rows: resp.data.data})
        })
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
        <TableHistory headings={headings} rows={this.state.rows}/>
      </div>
    );
  }
}


export default History;
