import { combineReducers } from 'redux'
import sharedState from './sharedState'
import currentSelected from './lecturer/select'
import assignmentStarted from './lecturer/startAssignment'
export default combineReducers({
    sharedState,
    currentSelected, 
    assignmentStarted,
})