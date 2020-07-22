import { Current_Receiver, Set_Receivers } from "../action/Receiver.js"
import { Current_Transfer_Receiver } from "../action/TransferReceiver.js"
import { Current_Debtor } from "../action/Debtor.js"

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
    case Current_Transfer_Receiver:
      return Object.assign({}, state, {
        currentTransferReceiver: action.receiver
      });
    case Current_Debtor:
      return Object.assign({}, state, {
        currentDebtor: action.debtor
      });
    default:
      return state
  }
}
