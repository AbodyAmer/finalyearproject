import {SELE} from '../../action/student/select'

const studentSelect = (state = {} , action) => {

    switch(action.type){
        case SELE: 
         return {
             currentModule: action.module, 
             currentIntake: action.intake
         }
         default: 
         return state
    }
}

export default studentSelect