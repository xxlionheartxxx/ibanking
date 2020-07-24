export const Current_Debtor = 'Current_Debtor'
export const Set_My_Debtors = 'Set_My_Debtors'
export const Set_My_Debts = 'Set_My_Debts'
export function pickDebtor(debtor) {
  return { type: Current_Debtor, debtor }
}
export function setMyDebtors(debtors) {
  return { type: Set_My_Debtors, debtors }
}
export function setMyDebts(debts) {
  return { type: Set_My_Debts, debts }
}
