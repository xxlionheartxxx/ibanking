export const Current_Receiver = 'Current_Receiver'
export const Set_Receivers = 'Set_Receivers'
export function pickReceiver(receiver) {
  return { type: Current_Receiver, receiver }
}
export function setReceivers(receivers) {
  return { type: Set_Receivers, receivers }
}
