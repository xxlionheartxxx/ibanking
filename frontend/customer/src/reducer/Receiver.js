import { Current_Receiver, Set_Receivers } from "../action/Receiver.js"

const initialState = {
}

export function receiver(state = initialState, action) {
  switch (action.type) {
    case Current_Receiver:
      return Object.assign({}, state, {
        currentReceiver: action.receiver
      });
    case Set_Receivers:
      return Object.assign({}, state, {
        receivers: action.receivers
      });
    default:
      return state
  }
}
