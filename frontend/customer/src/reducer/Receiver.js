import Current_Receiver from "../action/Receiver.js"

const initialState = {
  currentReceiver: {
    name: 'Hello'
  }
}

export default function pickReceiver(state = initialState, action) {
  switch (action.type) {
    case Current_Receiver:
      return Object.assign({}, state, {
        currentReceiver: action.receiver
      });
    default:
      return state
  }
}
