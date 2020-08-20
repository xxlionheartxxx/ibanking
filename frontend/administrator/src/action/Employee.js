export const Set_Employees = 'Set_Employees'
export const Pick_Employee = 'Pick_Employee'
export function setEmployees(employees) {
  return { type: Set_Employees, employees }
}
export function pickEmployee(employee) {
  return { type: Pick_Employee, employee }
}
