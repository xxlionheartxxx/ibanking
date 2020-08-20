import { createStore } from 'redux'
import ibanking from '../reducer/init.js'

const store = createStore(ibanking); 
export default store; 
