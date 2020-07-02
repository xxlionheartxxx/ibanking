export const Current_Transfer_Receiver = 'Current_Transfer_Receiver'
export function pickTransferReceiver(receiver) {
  return { type: Current_Transfer_Receiver, receiver }
}
