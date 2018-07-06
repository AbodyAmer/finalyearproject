import {started} from '../../action/lecturer/assignmentPage'

const assignmentStarted = (state = false, action) => {

    switch(action.type){
        case started: 
         state = true
         return state
         default: 
         return state
    }
}

export default assignmentStarted