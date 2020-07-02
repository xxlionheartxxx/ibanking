import React from 'react';
import store from '../store/init.js'
import { ListGroup } from "react-bootstrap";

class ExtranalReceiver extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myReceivers: [],
    };
    this.handleReceiversChange = this.handleReceiversChange.bind(this);
    this.render = this.render.bind(this);
  }
  handleReceiversChange() {
    if (!store.getState().receiver.receivers) {
      return
    }
    this.setState({myReceivers: store.getState().receiver.receivers.filter(item => item.bank_name!=="37Bank")})
    this.render()
  }
  componentDidMount() {
    const unsubcribe = store.subscribe(this.handleReceiversChange)
    this.setState({unsubcribe: unsubcribe})
    this.handleReceiversChange()
  }
  componentWillUnmount() {
    if (this.state.unsubcribe) {
    this.state.unsubcribe()
    }
  }
  render() {
    const {myReceivers} = this.state;
    const listReceivers = () => {
      if (myReceivers) {
        return myReceivers.map(item => {
          return (
          <ListGroup.Item action onClick={() =>store.dispatch(this.props.onClickItem(item))}>
            <div>
              <div>{item.name}</div>
              <div>{item.bank_number}</div>
            </div>
          </ListGroup.Item>
          )
        })
      }
      return
    };
    return (
      <div>
        <ListGroup>{listReceivers()}</ListGroup>
      </div>
    )
  }

}

export default ExtranalReceiver;
