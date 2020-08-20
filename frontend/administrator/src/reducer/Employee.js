import { Set_Employees, Pick_Employee } from "../action/Employee.js"

const initialState = {
}

export function employee(state = initialState, action) {
  switch (action.type) {
    case Set_Employees:
      return Object.assign({}, state, {
        employees: action.employees
      });
    case Pick_Employee:
      return Object.assign({}, state, {
        employee: action.employee
      });
    default:
      return state
  }
}
